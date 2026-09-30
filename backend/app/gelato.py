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
GELATO_ORDER_TYPE = os.getenv("GELATO_ORDER_TYPE", "order")
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
    "schweiz": "CH",
    "ch": "CH",
    "ierland": "IE",
    "ireland": "IE",
    "ie": "IE",
    "portugal": "PT",
    "pt": "PT",
    "denemarken": "DK",
    "dänemark": "DK",
    "denmark": "DK",
    "dk": "DK",
    "zweden": "SE",
    "schweden": "SE",
    "sweden": "SE",
    "se": "SE",
    "noorwegen": "NO",
    "norwegen": "NO",
    "norway": "NO",
    "no": "NO",
    "finland": "FI",
    "finnland": "FI",
    "fi": "FI",
    "luxemburg": "LU",
    "luxembourg": "LU",
    "lu": "LU",
}

# Strict whitelist of countries where Gelato delivers to (Europe, UK, USA)
ALLOWED_DELIVERY_COUNTRIES = {
    "NL", "BE", "DE", "AT", "CH", "GB", "FR", "IE", "ES", "IT", "PT", "DK", "SE", "NO", "FI", "LU", "US"
}


def is_country_supported(country_input: Optional[str]) -> bool:
    """Return True if country is in the European countries, UK, or USA delivery zone."""
    code = normalize_country_code(country_input)
    return code in ALLOWED_DELIVERY_COUNTRIES

# Standard Dimension Conversions in Millimeters for Gelato Product UIDs
SIZE_TO_MM = {
    "20x30": "200x300",
    "30x40": "300x400",
    "40x50": "400x500",
    "50x70": "500x700",
    "12x18": "300x450",
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

# Comprehensive ISO 3166-2:US 2-letter State & Territory mapping for Gelato
US_STATES_MAP = {
    "alabama": "AL", "al": "AL",
    "alaska": "AK", "ak": "AK",
    "arizona": "AZ", "az": "AZ",
    "arkansas": "AR", "ar": "AR",
    "california": "CA", "ca": "CA",
    "colorado": "CO", "co": "CO",
    "connecticut": "CT", "ct": "CT",
    "delaware": "DE", "de": "DE",
    "district of columbia": "DC", "washington dc": "DC", "washington d.c.": "DC", "dc": "DC",
    "florida": "FL", "fl": "FL",
    "georgia": "GA", "ga": "GA",
    "hawaii": "HI", "hi": "HI",
    "idaho": "ID", "id": "ID",
    "illinois": "IL", "il": "IL",
    "indiana": "IN", "in": "IN",
    "iowa": "IA", "ia": "IA",
    "kansas": "KS", "ks": "KS",
    "kentucky": "KY", "ky": "KY",
    "louisiana": "LA", "la": "LA",
    "maine": "ME", "me": "ME",
    "maryland": "MD", "md": "MD",
    "massachusetts": "MA", "ma": "MA",
    "michigan": "MI", "mi": "MI",
    "minnesota": "MN", "mn": "MN",
    "mississippi": "MS", "ms": "MS",
    "missouri": "MO", "mo": "MO",
    "montana": "MT", "mt": "MT",
    "nebraska": "NE", "ne": "NE",
    "nevada": "NV", "nv": "NV",
    "new hampshire": "NH", "nh": "NH",
    "new jersey": "NJ", "nj": "NJ",
    "new mexico": "NM", "nm": "NM",
    "new york": "NY", "ny": "NY",
    "north carolina": "NC", "nc": "NC",
    "north dakota": "ND", "nd": "ND",
    "ohio": "OH", "oh": "OH",
    "oklahoma": "OK", "ok": "OK",
    "oregon": "OR", "or": "OR",
    "pennsylvania": "PA", "pa": "PA",
    "rhode island": "RI", "ri": "RI",
    "south carolina": "SC", "sc": "SC",
    "south dakota": "SD", "sd": "SD",
    "tennessee": "TN", "tn": "TN",
    "texas": "TX", "tx": "TX",
    "utah": "UT", "ut": "UT",
    "vermont": "VT", "vt": "VT",
    "virginia": "VA", "va": "VA",
    "washington": "WA", "wa": "WA",
    "west virginia": "WV", "wv": "WV",
    "wisconsin": "WI", "wi": "WI",
    "wyoming": "WY", "wy": "WY",
    "puerto rico": "PR", "pr": "PR",
    "virgin islands": "VI", "vi": "VI",
    "guam": "GU", "gu": "GU",
}

# Estimated state sales tax rates for simulation mode
US_STATE_TAX_RATES = {
    "CA": 0.0825,
    "NY": 0.08875,
    "TX": 0.0825,
    "FL": 0.070,
    "IL": 0.0875,
    "PA": 0.060,
    "OH": 0.0725,
    "MI": 0.060,
    "NC": 0.070,
    "GA": 0.070,
    "NJ": 0.06625,
    "VA": 0.053,
    "WA": 0.092,
    "MA": 0.0625,
    "AZ": 0.084,
    "CO": 0.0775,
}


def normalize_country_code(country_input: Optional[str]) -> str:
    """Convert any localized country name to a standard ISO 2-letter code."""
    if not country_input:
        return "NL"
    clean = country_input.strip().lower()
    return COUNTRY_CODE_MAP.get(clean, country_input.strip().upper()[:2])


def normalize_state_code(state_input: Optional[str], country_code: str = "US") -> Optional[str]:
    """
    Resolve 2-letter uppercase ISO state code.
    Essential for US tax calculations and carrier routing in Gelato.
    """
    if not state_input:
        return None
    clean = state_input.strip().lower()
    if country_code == "US":
        code = US_STATES_MAP.get(clean)
        if code:
            return code
        if len(state_input.strip()) == 2:
            return state_input.strip().upper()
    return state_input.strip().upper() if len(state_input.strip()) <= 3 else state_input.strip()


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
    raw_state = customer.get("state")
    state_code = normalize_state_code(raw_state, country_iso)

    # Clean zip / postal code format (e.g. 1015CJ, 10028, or 10028-1234)
    raw_postcode = (customer.get("postal_code") or "1000AA").replace(" ", "").strip()

    shipping_address = {
        "firstName": first_name,
        "lastName": last_name,
        "addressLine1": customer.get("address_line1") or "Adres niet opgegeven",
        "addressLine2": customer.get("address_line2") or "",
        "city": customer.get("city") or "Amsterdam",
        "postCode": raw_postcode,
        "country": country_iso,
        "email": customer.get("email") or "klant@stellaire.nl",
        "phone": customer.get("phone") or "",
    }

    # Crucial for US tax calculation: Gelato v4 uses `state` (and accepts `stateCode`).
    # Both are populated to guarantee carrier routing and Avalara sales tax computation.
    if state_code:
        shipping_address["state"] = state_code
        shipping_address["stateCode"] = state_code

    # Clean empty optional keys
    if not shipping_address["addressLine2"]:
        del shipping_address["addressLine2"]
    if not shipping_address["phone"]:
        del shipping_address["phone"]

    # Match currency (order currency, or USD for US, GBP for GB, EUR for EU)
    currency = order.get("currency") or ("USD" if country_iso == "US" else "GBP" if country_iso == "GB" else "EUR")

    payload = {
        "orderType": GELATO_ORDER_TYPE,  # "draft" or "order"
        "orderReferenceId": order_id,
        "customerReferenceId": customer.get("email") or order_id,
        "currency": currency,
        "shippingMethod": "normal",
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

    customer = order.get("customer", {})
    country_iso = normalize_country_code(customer.get("country"))
    if country_iso not in ALLOWED_DELIVERY_COUNTRIES:
        return {
            "success": False,
            "status": "unsupported_destination",
            "error": f"Delivery to '{customer.get('country')}' ({country_iso}) is not supported. We only ship to European destinations, the UK, and the USA.",
            "gelato_order_id": None,
        }

    payload = build_gelato_order_payload(order)
    order_id = order.get("order_id", "STL-UNKNOWN")
    api_key = os.getenv("GELATO_API_KEY", "").strip()

    # Simulation fallback if no real API key is configured in local environment
    if not api_key or api_key.startswith("your_") or api_key == "test":
        mock_gelato_id = f"gel_mock_{order_id.lower().replace('-', '_')}"
        country_iso = payload["shippingAddress"].get("country", "NL")
        state_code = payload["shippingAddress"].get("state", "")

        # Realistic simulated wholesale cost and tax calculations
        is_framed = "frame_and_poster" in payload["items"][0]["productUid"]
        prod_cost = 24.50 if is_framed else 9.50
        ship_cost = 7.95
        subtotal = round(prod_cost + ship_cost, 2)
        curr = payload.get("currency", "EUR")

        if country_iso == "US":
            # US Destination State Tax rate (e.g., NY 8.875%, CA 8.25%, TX 8.25%, default 7.5%)
            tax_rate = US_STATE_TAX_RATES.get(state_code, 0.075) if state_code else 0.0
            tax_amt = round(subtotal * tax_rate, 2)
            tax_label = f"US State Sales Tax ({state_code or 'US'})" if state_code else "US Sales Tax (Exempt / No Nexus)"
        else:
            tax_rate = 0.21
            tax_amt = round(subtotal * tax_rate, 2)
            tax_label = "EU BTW (21%)"

        financials = {
            "currency": curr,
            "financial_status": "invoiced",
            "products_price": prod_cost,
            "shipping_price": ship_cost,
            "products_price_vat": round(prod_cost * tax_rate, 2),
            "shipping_price_vat": round(ship_cost * tax_rate, 2),
            "total_vat": tax_amt,
            "total_cost": subtotal,
            "total_incl_vat": round(subtotal + tax_amt, 2),
            "tax_note": f"{tax_label}: {curr} {tax_amt:.2f}",
        }

        return {
            "success": True,
            "status": "simulated",
            "mode": GELATO_ORDER_TYPE,
            "message": "Simulatie: GELATO_API_KEY is niet ingesteld in de omgevingsvariabelen. Order payload is succesvol gevalideerd.",
            "gelato_order_id": mock_gelato_id,
            "product_uid": payload["items"][0]["productUid"],
            "pdf_url": payload["items"][0]["files"][0]["url"],
            "payload": payload,
            "financials": financials,
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

            # Extract live Gelato financial and tax fields
            total_vat = float(res_data.get("totalVat") or 0.0)
            total_incl_vat = float(res_data.get("totalInclVat") or res_data.get("total") or 0.0)
            products_vat = float(res_data.get("productsPriceVat") or 0.0)
            shipping_vat = float(res_data.get("shippingPriceVat") or 0.0)
            curr = res_data.get("currency") or payload.get("currency", "EUR")

            financials = {
                "currency": curr,
                "financial_status": res_data.get("financialStatus", "invoiced"),
                "total_vat": total_vat,
                "total_incl_vat": total_incl_vat,
                "products_price_vat": products_vat,
                "shipping_price_vat": shipping_vat,
                "products_price": float(res_data.get("productsPrice") or 0.0),
                "shipping_price": float(res_data.get("shippingPrice") or 0.0),
                "tax_note": f"Gelato Tax/VAT: {curr} {total_vat:.2f}" if total_vat > 0 else "Gelato Tax: €0.00 (Exempt/Wholesale)",
            }

            return {
                "success": True,
                "status": res_data.get("orderType", GELATO_ORDER_TYPE),
                "fulfillment_status": res_data.get("fulfillmentStatus", "created"),
                "gelato_order_id": str(gelato_id),
                "raw_response": res_data,
                "financials": financials,
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
