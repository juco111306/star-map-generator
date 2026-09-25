"""
Gelato Print-on-Demand Integration Service for Stellaire & Co.
Automates dispatching 300 DPI print-ready star map PDFs to Gelato for printing,
framing (wooden light wood, black, white), and direct shipping to customers.
"""

from datetime import datetime
import json
import os
from typing import Any, Dict, Optional
import urllib.error
import urllib.request

# Environment Configuration
GELATO_API_KEY = os.getenv("GELATO_API_KEY", "")
GELATO_BASE_URL = os.getenv("GELATO_BASE_URL", "https://order.gelatoapis.com/v4")
# "draft" creates a safe order in your Gelato dashboard for inspection without charging.
# "order" creates a live production order immediately.
GELATO_ORDER_TYPE = os.getenv("GELATO_ORDER_TYPE", "draft")
PUBLIC_APP_URL = os.getenv("PUBLIC_APP_URL", os.getenv("APP_BASE_URL", "https://stellaire.nl"))

# ISO 3166-1 alpha-2 Country Mapping
COUNTRY_CODE_MAP = {
    "nederland": "NL",
    "netherlands": "NL",
    "the netherlands": "NL",
    "holland": "NL",
    "nl": "NL",
    "belgië": "BE",
    "belgie": "BE",
    "belgium": "BE",
    "be": "BE",
    "duitsland": "DE",
    "germany": "DE",
    "deutschland": "DE",
    "de": "DE",
    "frankrijk": "FR",
    "france": "FR",
    "fr": "FR",
    "verenigd koninkrijk": "GB",
    "united kingdom": "GB",
    "uk": "GB",
    "gb": "GB",
    "verenigde staten": "US",
    "united states": "US",
    "usa": "US",
    "us": "US",
    "spanje": "ES",
    "spain": "ES",
    "es": "ES",
    "italië": "IT",
    "italie": "IT",
    "italy": "IT",
    "it": "IT",
    "oostenrijk": "AT",
    "austria": "AT",
    "at": "AT",
    "zwitserland": "CH",
    "switzerland": "CH",
    "ch": "CH",
}

# Standard Dimension Conversions in Millimeters for Gelato Product UIDs
SIZE_TO_MM = {
    "20x30": "200x300",
    "30x40": "300x400",
    "40x50": "400x500",
    "50x70": "500x700",
    "18x24": "450x600",
    "24x36": "600x900",
}

# Frame Color Code Mapping for Gelato Wooden Frames
# Matches the natural light wood (oak), mat black, and pure white frame offerings
FRAME_COLOR_MAP = {
    "oak": "natural-wood",
    "natural": "natural-wood",
    "black": "black",
    "white": "white",
}


def normalize_country_code(country_input: Optional[str]) -> str:
    """Convert any localized country name to a standard ISO 2-letter code."""
    if not country_input:
        return "NL"
    clean = country_input.strip().lower()
    return COUNTRY_CODE_MAP.get(clean, country_input.strip().upper()[:2])


def get_gelato_product_uid(poster_size: str, frame_style: str) -> str:
    """
    Resolve the official Gelato Product UID based on poster dimensions and frame choice.
    - Flat poster: 200 gsm premium/classic matte archival paper
    - Wooden framed poster: solid wood frame (natural wood, black, white) with crystal plexiglass
    """
    size_mm = SIZE_TO_MM.get(poster_size, "500x700")

    if frame_style in ("digital", "none", "unframed"):
        # Classic Matte Unframed Poster (200 gsm FSC-certified matte paper)
        return f"flat_product_pf_{size_mm}-mm_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver"

    frame_color = FRAME_COLOR_MAP.get(frame_style, "natural-wood")
    # Wooden Framed Poster with 200 gsm Fine-Art Matte Paper
    return (
        f"frame_and_poster_product_frs_{size_mm}-mm_frc_{frame_color}_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_{size_mm}-mm_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver"
    )


def build_gelato_order_payload(order: Dict[str, Any]) -> Dict[str, Any]:
    """
    Construct the Gelato v4 Orders API request payload from an internal OrderRecord.
    """
    order_id = order.get("order_id", "STL-ORDER")
    customer = order.get("customer", {})
    poster_size = order.get("poster_size", "50x70")
    frame_style = order.get("frame_style", "none")

    # Split customer full name into first and last name
    full_name = (customer.get("name") or "Gewaardeerde Klant").strip()
    name_parts = full_name.split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else "."

    # Resolve PDF URL for Gelato's processing servers to ingest
    base_url = PUBLIC_APP_URL.rstrip("/")
    pdf_url = f"{base_url}/api/orders/{order_id}/pdf"

    product_uid = get_gelato_product_uid(poster_size, frame_style)
    country_iso = normalize_country_code(customer.get("country"))

    shipping_address = {
        "firstName": first_name,
        "lastName": last_name,
        "addressLine1": customer.get("address_line1") or "Adres niet opgegeven",
        "addressLine2": customer.get("address_line2") or "",
        "city": customer.get("city") or "Amsterdam",
        "postCode": (customer.get("postal_code") or "1000AA").replace(" ", ""),
        "country": country_iso,
        "email": customer.get("email") or "klant@stellaire.nl",
        "phone": customer.get("phone") or "",
    }

    # Clean empty optional keys
    if not shipping_address["addressLine2"]:
        del shipping_address["addressLine2"]
    if not shipping_address["phone"]:
        del shipping_address["phone"]

    payload = {
        "orderType": GELATO_ORDER_TYPE,  # "draft" or "order"
        "orderReferenceId": order_id,
        "customerReferenceId": customer.get("email") or order_id,
        "currency": "EUR",
        "items": [
            {
                "itemReferenceId": f"{order_id}-item-1",
                "productUid": product_uid,
                "quantity": 1,
                "files": [
                    {
                        "type": "default",
                        "url": pdf_url,
                    }
                ],
            }
        ],
        "shippingAddress": shipping_address,
    }

    return payload


def submit_order_to_gelato(order: Dict[str, Any]) -> Dict[str, Any]:
    """
    Submit an order to the Gelato Print-on-Demand API.
    - If digital order: returns skipped status.
    - If API key is not configured: returns a simulation/sandbox result for development.
    - If API key is present: sends HTTP POST to Gelato v4 /orders endpoint and returns Gelato reference.
    """
    frame_style = order.get("frame_style")
    if frame_style == "digital":
        return {
            "success": True,
            "status": "skipped",
            "message": "Digitale bestelling vereist geen fysieke Gelato printverzending.",
            "gelato_order_id": None,
        }

    payload = build_gelato_order_payload(order)
    order_id = order.get("order_id", "STL-UNKNOWN")
    api_key = os.getenv("GELATO_API_KEY", "").strip()

    # Simulation fallback if no real API key is configured in local environment
    if not api_key or api_key.startswith("your_") or api_key == "test":
        mock_gelato_id = f"gel_mock_{order_id.lower().replace('-', '_')}"
        return {
            "success": True,
            "status": "simulated",
            "mode": GELATO_ORDER_TYPE,
            "message": "Simulatie: GELATO_API_KEY is niet ingesteld in de omgevingsvariabelen. Order payload is succesvol gevalideerd.",
            "gelato_order_id": mock_gelato_id,
            "product_uid": payload["items"][0]["productUid"],
            "pdf_url": payload["items"][0]["files"][0]["url"],
            "payload": payload,
        }

    # Live or Draft API Call to Gelato
    endpoint = f"{GELATO_BASE_URL.rstrip('/')}/orders"
    req_body = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(
        endpoint,
        data=req_body,
        headers={
            "X-API-KEY": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Stellaire-Star-Map-Generator/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            gelato_id = res_data.get("id") or res_data.get("orderId") or res_data.get("orderReferenceId")
            return {
                "success": True,
                "status": res_data.get("orderType", GELATO_ORDER_TYPE),
                "fulfillment_status": res_data.get("fulfillmentStatus", "created"),
                "gelato_order_id": str(gelato_id),
                "raw_response": res_data,
                "message": f"Bestelling succesvol verzonden naar Gelato (Order ID: {gelato_id}).",
            }
    except urllib.error.HTTPError as http_err:
        err_body = http_err.read().decode("utf-8")
        try:
            err_json = json.loads(err_body)
            error_msg = err_json.get("message") or err_json.get("detail") or str(err_json)
        except Exception:
            error_msg = err_body
        return {
            "success": False,
            "status": "failed",
            "http_code": http_err.code,
            "error": f"Gelato API Fout ({http_err.code}): {error_msg}",
            "payload": payload,
        }
    except Exception as exc:
        return {
            "success": False,
            "status": "error",
            "error": f"Netwerkfout bij communicatie met Gelato: {str(exc)}",
            "payload": payload,
        }
