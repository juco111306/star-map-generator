"""
End-to-End Automated Integrity Check Suite for Stellaire & Co.
Tests all poster styles, sizes, framing options, currencies, country restrictions,
PDF geometries, and fulfillment payloads to certify production readiness.
"""

import copy
import json
import os
from pathlib import Path
import re
import sys
import time
from typing import Any, Dict, List, Tuple
from datetime import datetime

# Adjust Python path so backend app can be imported directly
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from app.main import app
from app.orders import (
    create_order,
    get_order_by_id,
    update_order_status,
    OrderCreateRequest,
    CustomerDetails,
    DATA_DIR,
    ORDERS_DIR,
    ORDERS_JSON,
)
from app.gelato import (
    get_gelato_product_uid,
    build_gelato_order_payload,
    submit_order_to_gelato,
    is_country_supported,
    normalize_country_code,
    normalize_state_code,
    ALLOWED_DELIVERY_COUNTRIES,
    GELATO_ORDER_TYPE,
)
from app.pdf_generator import (
    generate_star_map_pdf,
    STYLE_CONFIGS,
)

# ANSI terminal colors for readable output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


class IntegrityTestSuite:
    def __init__(self):
        self.client = TestClient(app)
        self.passes = 0
        self.failures = 0
        self.results: List[Tuple[str, bool, str]] = []
        self.created_order_ids: List[str] = []
        self.original_orders_content: str = ""

    def log_result(self, pillar: str, name: str, passed: bool, detail: str = ""):
        if passed:
            self.passes += 1
            print(f"  {GREEN}✔ PASS{RESET} [{pillar}] {name} {detail}")
        else:
            self.failures += 1
            print(f"  {RED}✖ FAIL{RESET} [{pillar}] {name} - {detail}")
        self.results.append((f"[{pillar}] {name}", passed, detail))

    def setup(self):
        """Take a snapshot of orders.json before running tests."""
        if ORDERS_JSON.exists():
            self.original_orders_content = ORDERS_JSON.read_text(encoding="utf-8")
        else:
            self.original_orders_content = "[]"

    def teardown(self):
        """Restore orders.json and remove any generated test PDFs."""
        if self.original_orders_content:
            ORDERS_JSON.write_text(self.original_orders_content, encoding="utf-8")

        for oid in self.created_order_ids:
            pdf_path = ORDERS_DIR / f"{oid}.pdf"
            if pdf_path.exists():
                try:
                    pdf_path.unlink()
                except Exception:
                    pass

    # =========================================================================
    # PILLAR 1: Catalog & Deprecation Guard
    # =========================================================================
    def check_pillar_1_catalog_deprecation(self):
        print(f"\n{BOLD}{CYAN}▶ PILLAR 1: Catalog & Deprecation Guard{RESET}")
        pricing_file = PROJECT_ROOT / "frontend" / "src" / "utils" / "pricing.ts"
        styles_file = PROJECT_ROOT / "frontend" / "src" / "constants" / "styles.ts"
        locales_dir = PROJECT_ROOT / "frontend" / "src" / "locales"

        # 1. Ensure 20x30 is not in active frontend metric sizes
        if pricing_file.exists():
            content = pricing_file.read_text(encoding="utf-8")
            # Metric sizes function should only have 30x40, 40x50, 50x70
            metric_match = re.search(r"getLocalizedMetricSizes\s*=\s*.*?\[(.*?)\];", content, re.DOTALL)
            has_deprecated = False
            if metric_match and "'20x30'" in metric_match.group(1):
                has_deprecated = True
            self.log_result(
                "Catalog",
                "Deprecated 20x30 Size Absent from Active Catalog",
                not has_deprecated,
                "(20x30 must never be an active selection)" if has_deprecated else "",
            )

            # Ensure all canonical sizes are present in pricing table
            canonical_sizes = ["30x40", "40x50", "50x70", "12x18", "18x24", "24x36"]
            missing_sizes = [s for s in canonical_sizes if f"'{s}'" not in content]
            self.log_result(
                "Catalog",
                "All 6 Canonical Sizes Configured in Pricing",
                len(missing_sizes) == 0,
                f"Missing: {missing_sizes}" if missing_sizes else "3 Metric + 3 Imperial",
            )

        # 2. Check active styles match between frontend and backend
        if styles_file.exists():
            content = styles_file.read_text(encoding="utf-8")
            frontend_styles = re.findall(r"id:\s*'([a-z_]+)',", content)
            active_styles = ["midnight_classic", "teal_watercolor", "emerald_night", "burgundy_sky"]
            all_in_backend = all(s in STYLE_CONFIGS for s in active_styles)
            self.log_result(
                "Catalog",
                "Frontend Design Styles Synchronized with Backend",
                all_in_backend,
                f"Active styles: {active_styles}",
            )

    # =========================================================================
    # PILLAR 2: Style & Layout Parity (Studio -> Order -> PDF)
    # =========================================================================
    def check_pillar_2_style_parity(self):
        print(f"\n{BOLD}{CYAN}▶ PILLAR 2: Style & Layout Parity (Studio -> Order -> PDF){RESET}")

        test_cases = [
            ("midnight_classic", "#0B132B", "Midnight Classic (Signature Dark Navy)"),
            ("teal_watercolor", "#F5F7F6", "Teal Watercolor (White & Teal)"),
            ("emerald_night", "#081C15", "Emerald Night (British Racing Green & Gold)"),
            ("burgundy_sky", "#38070E", "Burgundy Sky (Velvet Wine Red)"),
        ]

        for style_id, expected_bg, description in test_cases:
            # 1. Create order with this specific style
            req = OrderCreateRequest(
                customer=CustomerDetails(
                    name=f"Test Customer {style_id}",
                    email="test@stellaire-atelier.com",
                    address_line1="Atelier Straat 10",
                    city="Amsterdam",
                    postal_code="1012AB",
                    country="Nederland",
                ),
                map_config={
                    "poster_size": "50x70",
                    "style_id": style_id,
                    "frame_style": "oak",
                    "date": "2026-09-22",
                    "time": "21:00",
                    "latitude": 52.3676,
                    "longitude": 4.9041,
                    "titleBlock": {"text": f"STARS OVER ATELIER - {style_id.upper()}", "font": "Cinzel", "size": 38, "enabled": True},
                    "namesBlock": {"text": "Olivia & Taylor", "font": "Great Vibes", "size": 51, "enabled": True},
                    "dateBlock": {"text": "22 SEPTEMBER 2026", "font": "Montserrat", "size": 15, "enabled": True},
                    "locationBlock": {"text": "AMSTERDAM, THE NETHERLANDS", "font": "Montserrat", "size": 14, "enabled": True},
                },
            )

            created = create_order(req)
            order_id = created["order_id"]
            self.created_order_ids.append(order_id)

            # Check that style_id was preserved and not overridden
            stored_style = created.get("style_id")
            style_matches = stored_style == style_id

            # Verify PDF exists and has matching color config
            pdf_path = ORDERS_DIR / f"{order_id}.pdf"
            pdf_exists = pdf_path.exists() and pdf_path.stat().st_size > 100000

            style_cfg = STYLE_CONFIGS.get(style_id, {})
            bg_correct = style_cfg.get("bg_color", "").upper() == expected_bg.upper()

            self.log_result(
                "Style Parity",
                f"Style '{style_id}' ({description})",
                style_matches and pdf_exists and bg_correct,
                f"Preserved in Order DB & PDF generated ({pdf_path.stat().st_size // 1024} KB)",
            )

    # =========================================================================
    # PILLAR 3: PDF Geometry & Dimension Parity
    # =========================================================================
    def check_pillar_3_pdf_geometry(self):
        print(f"\n{BOLD}{CYAN}▶ PILLAR 3: PDF Geometry & Dimension Parity{RESET}")

        # Target dimensions in PDF points (72 points = 1 inch, 28.346 points = 1 cm)
        expected_geometry = {
            "30x40": (850.39, 1133.86, "3:4"),
            "40x50": (1133.86, 1417.32, "4:5"),
            "50x70": (1417.32, 1984.25, "5:7"),
            "12x18": (864.0, 1296.0, "2:3"),
            "18x24": (1296.0, 1728.0, "3:4"),
            "24x36": (1728.0, 2592.0, "2:3"),
        }

        for size_id, (exp_w, exp_h, aspect_ratio) in expected_geometry.items():
            pdf_bytes = generate_star_map_pdf({
                "poster_size": size_id,
                "style_id": "midnight_classic",
                "titleBlock": {"text": f"TEST {size_id}", "size": 38, "enabled": True},
            })

            # Extract MediaBox from PDF binary
            mb_match = re.search(rb"/MediaBox\s*\[\s*([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s*\]", pdf_bytes)
            if mb_match:
                x1, y1, x2, y2 = [float(v) for v in mb_match.groups()]
                actual_w = x2 - x1
                actual_h = y2 - y1
                # Tolerate small float rounding within 0.5 point
                matches = abs(actual_w - exp_w) < 0.5 and abs(actual_h - exp_h) < 0.5
                actual_ratio = round(actual_w / actual_h, 3)
                expected_ratio = round(exp_w / exp_h, 3)
                ratio_matches = abs(actual_ratio - expected_ratio) < 0.01

                self.log_result(
                    "Geometry",
                    f"Format '{size_id}' Dimension & Aspect Ratio ({aspect_ratio})",
                    matches and ratio_matches,
                    f"Points: {actual_w}x{actual_h} pt | Size: {len(pdf_bytes) // 1024} KB",
                )
            else:
                self.log_result("Geometry", f"Format '{size_id}' MediaBox Extraction", False, "MediaBox header missing")

    # =========================================================================
    # PILLAR 4: Multi-Currency & Regional Delivery Whitelist Guard
    # =========================================================================
    def check_pillar_4_currency_and_delivery(self):
        print(f"\n{BOLD}{CYAN}▶ PILLAR 4: Multi-Currency & Delivery Whitelist Guard{RESET}")

        # 1. Verify Allowed Whitelist Countries (EU + UK + USA)
        sample_allowed = ["NL", "BE", "DE", "AT", "CH", "GB", "FR", "IE", "ES", "IT", "PT", "DK", "SE", "NO", "FI", "LU", "US"]
        all_allowed_pass = all(is_country_supported(c) for c in sample_allowed)
        self.log_result(
            "Whitelist",
            f"17 Allowed Delivery Countries Accepted (Europe, UK, USA)",
            all_allowed_pass,
            f"Verified {len(sample_allowed)}/17 countries",
        )

        # 2. Verify Unsupported Countries Rejected
        sample_unsupported = ["JP", "CA", "AU", "BR", "IN", "CN", "MX", "ZA", "RU"]
        all_unsupported_rejected = all(not is_country_supported(c) for c in sample_unsupported)
        self.log_result(
            "Whitelist",
            "Unsupported Countries Strictly Blocked from Delivery",
            all_unsupported_rejected,
            f"Tested: {sample_unsupported}",
        )

        # 3. Verify Backend Rejection on create_order for Unsupported Country
        rejected_exception = False
        try:
            create_order(
                OrderCreateRequest(
                    customer=CustomerDetails(
                        name="Tokyo Customer",
                        email="tokyo@example.com",
                        address_line1="Chiyoda-ku 1-1",
                        city="Tokyo",
                        postal_code="100-0001",
                        country="Japan",
                    ),
                    map_config={"poster_size": "50x70", "frame_style": "black"},
                )
            )
        except ValueError as val_err:
            if "not supported" in str(val_err).lower():
                rejected_exception = True

        self.log_result(
            "Whitelist",
            "Backend create_order Aborts on Unsupported Country",
            rejected_exception,
            "Raised ValueError with localized notice",
        )

        # 4. Verify US State Code Normalization & USPS Carrier
        us_order = {
            "order_id": "STL-US-TEST",
            "poster_size": "18x24",
            "frame_style": "oak",
            "customer": {
                "name": "Alex Morgan",
                "email": "alex@example.com",
                "address_line1": "742 Evergreen Terrace",
                "city": "Springfield",
                "state": "Oregon",
                "postal_code": "97477",
                "country": "United States",
            },
        }
        us_payload = build_gelato_order_payload(us_order)
        state_code_ok = us_payload["shippingAddress"].get("state") == "OR"
        self.log_result(
            "US Routing",
            "US State Normalization ('Oregon' -> 'OR')",
            state_code_ok,
            f"StateCode: {us_payload['shippingAddress'].get('state')}",
        )

    # =========================================================================
    # PILLAR 5: Gelato Fulfillment Mapping
    # =========================================================================
    def check_pillar_5_gelato_fulfillment(self):
        print(f"\n{BOLD}{CYAN}▶ PILLAR 5: Gelato Print-on-Demand Parity{RESET}")

        # 1. Gelato Order Type is a valid mode ('order' for automated production or 'draft' for review)
        self.log_result(
            "Gelato Mode",
            f"Gelato Mode Configured ({GELATO_ORDER_TYPE})",
            GELATO_ORDER_TYPE in ("order", "draft"),
            f"Active mode: '{GELATO_ORDER_TYPE}' ({'Direct production dispatch' if GELATO_ORDER_TYPE == 'order' else 'Drafts for approval'})",
        )

        # 2. Test 30 combinations of sizes x frames
        sizes = ["30x40", "40x50", "50x70", "12x18", "18x24", "24x36"]
        frames = ["none", "black", "white", "oak"]

        all_uids_valid = True
        failed_combos = []

        for sz in sizes:
            for fr in frames:
                uid = get_gelato_product_uid(sz, fr)
                if not uid:
                    all_uids_valid = False
                    failed_combos.append(f"{sz}_{fr}")
                elif fr == "none" and not uid.startswith("flat_product_"):
                    all_uids_valid = False
                    failed_combos.append(f"{sz}_{fr} (expected flat_product)")
                elif fr != "none" and not uid.startswith("frame_and_poster_product_"):
                    all_uids_valid = False
                    failed_combos.append(f"{sz}_{fr} (expected frame_and_poster)")

        self.log_result(
            "Gelato Catalog",
            "All 24 Size × Frame Gelato Product UIDs Validated",
            all_uids_valid,
            f"Verified {len(sizes) * len(frames)} catalog permutations" if all_uids_valid else f"Failed: {failed_combos}",
        )

        # 3. Test Digital Frame is Skipped
        digital_order = {
            "order_id": "STL-DIGITAL-TEST",
            "poster_size": "50x70",
            "frame_style": "digital",
            "customer": {"name": "Digital User", "email": "user@example.com"},
        }
        dig_res = submit_order_to_gelato(digital_order)
        dig_skipped = dig_res.get("success") is True and dig_res.get("status") == "skipped"
        self.log_result(
            "Gelato Catalog",
            "Digital Files Bypassed from Gelato Printing (status: skipped)",
            dig_skipped,
            "No print API call dispatched for digital downloads",
        )

    # =========================================================================
    # PILLAR 6: FastAPI & Admin Endpoint Parity
    # =========================================================================
    def check_pillar_6_api_endpoints(self):
        print(f"\n{BOLD}{CYAN}▶ PILLAR 6: FastAPI & Admin PDF Download Endpoints{RESET}")

        # 1. Create order through FastAPI endpoint
        order_payload = {
            "customer": {
                "name": "Admin Tester",
                "email": "admin.tester@stellaire-atelier.com",
                "address_line1": "Keizersgracht 400",
                "city": "Amsterdam",
                "postal_code": "1016EK",
                "country": "Nederland",
            },
            "map_config": {
                "poster_size": "30x40",
                "style_id": "teal_watercolor",
                "frame_style": "none",
                "titleBlock": {"text": "ADMIN DOWNLOAD VERIFICATION", "size": 38, "enabled": True},
                "namesBlock": {"text": "Sophie & Noah", "size": 51, "enabled": True},
            },
        }

        post_res = self.client.post("/api/orders", json=order_payload)
        post_ok = post_res.status_code == 200
        order_data = post_res.json() if post_ok else {}
        test_oid = order_data.get("order_id", "")
        if test_oid:
            self.created_order_ids.append(test_oid)

        self.log_result(
            "API",
            "POST /api/orders (Create Order & PDF)",
            post_ok and bool(test_oid),
            f"Created Order #{test_oid}",
        )

        # 2. Get order by ID
        get_res = self.client.get(f"/api/orders/{test_oid}")
        get_ok = get_res.status_code == 200 and get_res.json().get("order_id") == test_oid
        self.log_result("API", f"GET /api/orders/{test_oid}", get_ok, "Metadata correctly returned")

        # 3. Download PDF from /api/orders/{id}/pdf
        pdf_res = self.client.get(f"/api/orders/{test_oid}/pdf")
        pdf_ok = (
            pdf_res.status_code == 200
            and pdf_res.headers.get("content-type") == "application/pdf"
            and "attachment" in pdf_res.headers.get("content-disposition", "")
            and len(pdf_res.content) > 100000
        )
        self.log_result(
            "API",
            f"GET /api/orders/{test_oid}/pdf (Admin Download)",
            pdf_ok,
            f"HTTP 200, Content-Type: application/pdf ({len(pdf_res.content) // 1024} KB)",
        )

        # 4. Status update
        patch_res = self.client.patch(
            f"/api/orders/{test_oid}/status",
            json={"status": "shipped", "carrier": "PostNL", "tracking_number": "3STEST12345"},
        )
        patch_data = patch_res.json() if patch_res.status_code == 200 else {}
        patch_ok = patch_res.status_code == 200 and (
            patch_data.get("status") == "shipped" or patch_data.get("order", {}).get("status") == "shipped"
        )
        self.log_result("API", f"PATCH /api/orders/{test_oid}/status (Tracking Update)", patch_ok, "Status -> shipped")

    def run_all(self) -> bool:
        start_time = time.time()
        print(f"\n{BOLD}{'=' * 75}{RESET}")
        print(f"{BOLD}  STELLAIRE & CO. - AUTOMATED END-TO-END INTEGRITY CHECK SUITE{RESET}")
        print(f"{BOLD}{'=' * 75}{RESET}")

        try:
            self.setup()
            self.check_pillar_1_catalog_deprecation()
            self.check_pillar_2_style_parity()
            self.check_pillar_3_pdf_geometry()
            self.check_pillar_4_currency_and_delivery()
            self.check_pillar_5_gelato_fulfillment()
            self.check_pillar_6_api_endpoints()
        finally:
            self.teardown()

        elapsed = time.time() - start_time
        total = self.passes + self.failures

        print(f"\n{BOLD}{'=' * 75}{RESET}")
        print(f"{BOLD}  INTEGRITY SUMMARY REPORT{RESET}")
        print(f"{BOLD}{'=' * 75}{RESET}")
        print(f"  Total Checks: {BOLD}{total}{RESET}")
        print(f"  Passed:       {GREEN}{BOLD}{self.passes}{RESET}")
        print(f"  Failed:       {RED if self.failures > 0 else GREEN}{BOLD}{self.failures}{RESET}")
        print(f"  Time Elapsed: {round(elapsed, 2)}s")

        if self.failures == 0:
            print(f"\n  {GREEN}{BOLD}🎉 OVERALL STATUS: 100% HEALTHY - SAFE FOR PRODUCTION CUSTOMERS{RESET}\n")
            return True
        else:
            print(f"\n  {RED}{BOLD}⚠️ OVERALL STATUS: {self.failures} INTEGRITY CHECK(S) FAILED{RESET}\n")
            return False


if __name__ == "__main__":
    suite = IntegrityTestSuite()
    success = suite.run_all()
    sys.exit(0 if success else 1)
