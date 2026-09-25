"""
Order management and print fulfillment module for Stellaire & Co.
Stores customer orders and archives 300 DPI print-ready PDFs for the print workshop.
"""
from datetime import datetime
import json
from pathlib import Path
import random
import string
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from app.pdf_generator import generate_star_map_pdf

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
ORDERS_DIR = DATA_DIR / "orders"
ORDERS_JSON = DATA_DIR / "orders.json"


class CustomerDetails(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: Optional[str] = ""
    postal_code: str
    country: str = "United States"
    gift_note: Optional[str] = ""
    producer_notes: Optional[str] = ""


class OrderCreateRequest(BaseModel):
    customer: CustomerDetails
    map_config: Dict[str, Any]


class TimelineEvent(BaseModel):
    status: str
    timestamp: str
    title: str
    description: str


class OrderRecord(BaseModel):
    order_id: str
    created_at: str
    status: str = "in_production"
    customer: CustomerDetails
    poster_size: str
    style_id: str
    frame_style: str
    title_text: str
    names_text: str
    date_text: str
    location_text: str
    pdf_filename: str
    pdf_size_bytes: int
    carrier: Optional[str] = "PostNL"
    tracking_number: Optional[str] = ""
    tracking_url: Optional[str] = ""
    timeline: List[TimelineEvent] = Field(default_factory=list)


def _init_storage():
    ORDERS_DIR.mkdir(parents=True, exist_ok=True)
    if not ORDERS_JSON.exists():
        ORDERS_JSON.write_text("[]", encoding="utf-8")


def generate_order_id() -> str:
    """Generate a clean luxury order reference like STL-84920."""
    digits = "".join(random.choices(string.digits, k=5))
    return f"STL-{digits}"


def _build_default_timeline(status: str, created_at: str, carrier: str = "PostNL", tracking_number: str = "") -> List[Dict[str, Any]]:
    """Build a default progression timeline based on order status and creation time."""
    events = [
        {
            "status": "confirmed",
            "timestamp": created_at,
            "title": "Bestelling Ontvangen",
            "description": "Uw sterrenkaart compositie en gegevens zijn succesvol vastgelegd in ons atelier.",
        },
        {
            "status": "in_production",
            "timestamp": created_at,
            "title": "In Atelier Productie",
            "description": "300 DPI archiefwaardige print-PDF is met astronomische precisie berekend.",
        },
    ]

    if status in ("printed", "shipped", "delivered"):
        events.append({
            "status": "printed",
            "timestamp": created_at,
            "title": "Gedrukt & Geïnspecteerd",
            "description": "Geprint op 285 gsm fine-art papier en onderworpen aan de ambachtelijke kwaliteitscontrole.",
        })

    if status in ("shipped", "delivered"):
        tracking_info = f" met trackingcode {tracking_number}" if tracking_number else ""
        events.append({
            "status": "shipped",
            "timestamp": created_at,
            "title": f"Verzonden via {carrier}",
            "description": f"Uw bestelling is overgedragen aan {carrier}{tracking_info}.",
        })

    if status == "delivered":
        events.append({
            "status": "delivered",
            "timestamp": created_at,
            "title": "Bezorgd",
            "description": "Uw gepersonaliseerde sterrenposter is succesvol afgeleverd.",
        })

    return events


def _normalize_order(order: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure order dictionary has all modern tracking attributes and localized labels."""
    normalized = dict(order)

    # Normalize status: map legacy 'ready_for_print' to 'in_production'
    raw_status = normalized.get("status", "in_production")
    if raw_status in ("ready_for_print", "pending", "processing"):
        normalized["status"] = "in_production"
    else:
        normalized["status"] = raw_status

    is_digital = normalized.get("frame_style") == "digital"
    default_carrier = "Digitale Levering per E-mail" if is_digital else "PostNL"
    carrier = normalized.get("carrier") or default_carrier
    normalized["carrier"] = carrier

    tracking_num = normalized.get("tracking_number", "")
    normalized["tracking_number"] = tracking_num

    # Generate tracking URL if tracking number is present
    if tracking_num and not normalized.get("tracking_url"):
        postal_code = (normalized.get("customer", {}).get("postal_code") or "").replace(" ", "")
        if "postnl" in carrier.lower():
            normalized["tracking_url"] = f"https://jouw.postnl.nl/track-and-trace/{tracking_num}-NL-{postal_code}"
        elif "bpost" in carrier.lower():
            normalized["tracking_url"] = f"https://track.bpost.cloud/btr/web/#/search?itemCode={tracking_num}"
        else:
            normalized["tracking_url"] = ""

    # Ensure timeline exists
    if not normalized.get("timeline"):
        normalized["timeline"] = _build_default_timeline(
            normalized["status"],
            normalized.get("created_at", datetime.utcnow().isoformat() + "Z"),
            carrier,
            tracking_num,
        )

    return normalized


def get_all_orders() -> List[Dict[str, Any]]:
    """Return all orders in reverse chronological order with normalized attributes."""
    _init_storage()
    try:
        data = json.loads(ORDERS_JSON.read_text(encoding="utf-8"))
        normalized = [_normalize_order(o) for o in data]
        return sorted(normalized, key=lambda x: x.get("created_at", ""), reverse=True)
    except Exception as e:
        print("Error reading orders:", e)
        return []


def get_order_by_id(order_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve single order by order_id."""
    clean_id = order_id.strip().upper()
    if not clean_id.startswith("STL-") and clean_id.isdigit():
        clean_id = f"STL-{clean_id}"

    orders = get_all_orders()
    for o in orders:
        if o.get("order_id") == clean_id:
            return o
    return None


def get_order_pdf_path(order_id: str) -> Optional[Path]:
    """Return the absolute path to the stored 300 DPI PDF for this order."""
    _init_storage()
    clean_id = order_id.strip().upper()
    if not clean_id.startswith("STL-") and clean_id.isdigit():
        clean_id = f"STL-{clean_id}"

    pdf_path = ORDERS_DIR / f"{clean_id}.pdf"
    if pdf_path.exists():
        return pdf_path
    return None


def get_orders_by_email(email: str) -> List[Dict[str, Any]]:
    """
    Retrieve all orders placed with a given email address.
    Returns customer-sanitized copies (hiding internal producer notes).
    """
    clean_email = email.strip().lower()
    if not clean_email:
        return []

    orders = get_all_orders()
    matched = []
    for o in orders:
        cust_email = (o.get("customer", {}).get("email") or "").strip().lower()
        if cust_email == clean_email:
            sanitized = dict(o)
            # Remove internal workshop note for privacy
            if "customer" in sanitized and isinstance(sanitized["customer"], dict):
                cust_copy = dict(sanitized["customer"])
                cust_copy.pop("producer_notes", None)
                sanitized["customer"] = cust_copy
            matched.append(sanitized)

    return matched


def get_order_by_id_and_email(order_id: str, email: str) -> Optional[Dict[str, Any]]:
    """
    Verify customer identity by requiring both Order ID and Email to match.
    Provides secure guest-order tracking without passwords.
    """
    clean_id = order_id.strip().upper()
    if not clean_id.startswith("STL-") and clean_id.isdigit():
        clean_id = f"STL-{clean_id}"

    clean_email = email.strip().lower()
    if not clean_id or not clean_email:
        return None

    order = get_order_by_id(clean_id)
    if not order:
        return None

    cust_email = (order.get("customer", {}).get("email") or "").strip().lower()
    if cust_email != clean_email:
        return None

    sanitized = dict(order)
    if "customer" in sanitized and isinstance(sanitized["customer"], dict):
        cust_copy = dict(sanitized["customer"])
        cust_copy.pop("producer_notes", None)
        sanitized["customer"] = cust_copy

    return sanitized


def update_order_status(
    order_id: str,
    new_status: str,
    carrier: Optional[str] = None,
    tracking_number: Optional[str] = None,
    note: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """
    Update order status, shipping details, and append an event to the timeline.
    """
    _init_storage()
    clean_id = order_id.strip().upper()
    if not clean_id.startswith("STL-") and clean_id.isdigit():
        clean_id = f"STL-{clean_id}"

    try:
        raw_orders = json.loads(ORDERS_JSON.read_text(encoding="utf-8"))
    except Exception:
        raw_orders = []

    target_idx = None
    for idx, o in enumerate(raw_orders):
        if o.get("order_id") == clean_id:
            target_idx = idx
            break

    if target_idx is None:
        return None

    order = _normalize_order(raw_orders[target_idx])
    now_iso = datetime.utcnow().isoformat() + "Z"

    # Status title & descriptions dictionary
    status_descriptions = {
        "confirmed": ("Bestelling Bevestigd", "Bestelling is succesvol vastgelegd."),
        "in_production": ("In Atelier Productie", "300 DPI vector PDF is geverifieerd en klaargezet voor productie."),
        "printed": ("Gedrukt & Geïnspecteerd", "De poster is gedrukt op archiefwaardig 285 gsm katoenpapier."),
        "shipped": ("Verzonden", f"Pakket is overgedragen aan {carrier or order.get('carrier', 'de bezorgdienst')}."),
        "delivered": ("Afgeleverd", "Uw sterrenkaart is bezorgd op de bestemming."),
    }

    order["status"] = new_status
    if carrier:
        order["carrier"] = carrier
    if tracking_number is not None:
        order["tracking_number"] = tracking_number

        postal_code = (order.get("customer", {}).get("postal_code") or "").replace(" ", "")
        if "postnl" in (order.get("carrier") or "").lower():
            order["tracking_url"] = f"https://jouw.postnl.nl/track-and-trace/{tracking_number}-NL-{postal_code}"
        elif "bpost" in (order.get("carrier") or "").lower():
            order["tracking_url"] = f"https://track.bpost.cloud/btr/web/#/search?itemCode={tracking_number}"

    title, desc = status_descriptions.get(new_status, (new_status.title(), note or "Status bijgewerkt."))
    if note:
        desc = note

    new_event = {
        "status": new_status,
        "timestamp": now_iso,
        "title": title,
        "description": desc,
    }

    order.setdefault("timeline", []).append(new_event)

    raw_orders[target_idx] = order
    ORDERS_JSON.write_text(json.dumps(raw_orders, indent=2), encoding="utf-8")
    return order


def create_order(req: OrderCreateRequest) -> Dict[str, Any]:
    """
    Generate 300 DPI PDF, archive it in the orders folder, and save metadata.
    """
    _init_storage()
    order_id = generate_order_id()
    created_at = datetime.utcnow().isoformat() + "Z"

    # 1. Compile 300 DPI Print-Ready PDF
    config = dict(req.map_config)
    date_time_str = config.get("date_time") or f"{config.get('date', '2026-09-22')}T{config.get('time', '21:00')}:00Z"
    try:
        dt = datetime.fromisoformat(date_time_str.replace("Z", "+00:00"))
    except ValueError:
        dt = datetime(2026, 9, 22, 21, 0)
    config["date_time"] = dt

    pdf_bytes = generate_star_map_pdf(config)

    # 2. Save PDF file to storage
    pdf_filename = f"{order_id}_print_ready_300dpi.pdf"
    pdf_path = ORDERS_DIR / f"{order_id}.pdf"
    pdf_path.write_bytes(pdf_bytes)

    # 3. Extract order summary
    title_block = config.get("titleBlock") or {}
    names_block = config.get("namesBlock") or {}
    date_block = config.get("dateBlock") or {}
    location_block = config.get("locationBlock") or {}

    frame_style = config.get("frame_style", config.get("frameStyle", "none"))
    is_digital = frame_style == "digital"
    carrier = "Digitale Levering per E-mail" if is_digital else "PostNL"

    initial_timeline = [
        {
            "status": "confirmed",
            "timestamp": created_at,
            "title": "Bestelling Bevestigd",
            "description": "Uw sterrenkaart compositie en gegevens zijn succesvol vastgelegd in ons atelier.",
        },
        {
            "status": "in_production",
            "timestamp": created_at,
            "title": "In Atelier Productie",
            "description": "300 DPI archiefwaardige print-PDF is met astronomische precisie berekend.",
        },
    ]

    order_record = {
        "order_id": order_id,
        "created_at": created_at,
        "status": "in_production",
        "customer": req.customer.dict(),
        "poster_size": config.get("poster_size", "18x24"),
        "style_id": config.get("style_id", "midnight_classic"),
        "frame_style": frame_style,
        "title_text": title_block.get("text") or config.get("main_title", "The Night We Met"),
        "names_text": names_block.get("text") or config.get("subtitle", "Emma & Noah"),
        "date_text": date_block.get("text") or config.get("date", "September 22, 2026"),
        "location_text": location_block.get("text") or config.get("locationName", "New York, USA"),
        "pdf_filename": pdf_filename,
        "pdf_size_bytes": len(pdf_bytes),
        "carrier": carrier,
        "tracking_number": "",
        "tracking_url": "",
        "timeline": initial_timeline,
    }

    # 4. Append to orders.json
    try:
        raw_orders = json.loads(ORDERS_JSON.read_text(encoding="utf-8"))
    except Exception:
        raw_orders = []
    raw_orders.insert(0, order_record)
    ORDERS_JSON.write_text(json.dumps(raw_orders, indent=2), encoding="utf-8")

    return order_record
