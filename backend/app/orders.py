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


class OrderRecord(BaseModel):
    order_id: str
    created_at: str
    status: str = "ready_for_print"
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


def _init_storage():
    ORDERS_DIR.mkdir(parents=True, exist_ok=True)
    if not ORDERS_JSON.exists():
        ORDERS_JSON.write_text("[]", encoding="utf-8")


def generate_order_id() -> str:
    """Generate a clean luxury order reference like STL-84920."""
    digits = "".join(random.choices(string.digits, k=5))
    return f"STL-{digits}"


def get_all_orders() -> List[Dict[str, Any]]:
    """Return all orders in reverse chronological order."""
    _init_storage()
    try:
        data = json.loads(ORDERS_JSON.read_text(encoding="utf-8"))
        return sorted(data, key=lambda x: x.get("created_at", ""), reverse=True)
    except Exception as e:
        print("Error reading orders:", e)
        return []


def get_order_by_id(order_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve single order by order_id."""
    orders = get_all_orders()
    for o in orders:
        if o.get("order_id") == order_id:
            return o
    return None


def get_order_pdf_path(order_id: str) -> Optional[Path]:
    """Return the absolute path to the stored 300 DPI PDF for this order."""
    _init_storage()
    pdf_path = ORDERS_DIR / f"{order_id}.pdf"
    if pdf_path.exists():
        return pdf_path
    return None


def create_order(req: OrderCreateRequest) -> Dict[str, Any]:
    """
    Generate 300 DPI PDF, archive it in the orders folder, and save metadata.
    """
    _init_storage()
    order_id = generate_order_id()
    created_at = datetime.utcnow().isoformat() + "Z"

    # 1. Compile 300 DPI Print-Ready PDF
    config = dict(req.map_config)
    # Ensure datetime object is available for astronomy engine
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

    order_record = {
        "order_id": order_id,
        "created_at": created_at,
        "status": "ready_for_print",
        "customer": req.customer.dict(),
        "poster_size": config.get("poster_size", "18x24"),
        "style_id": config.get("style_id", "midnight_classic"),
        "frame_style": config.get("frame_style", config.get("frameStyle", "none")),
        "title_text": title_block.get("text") or config.get("main_title", "The Night We Met"),
        "names_text": names_block.get("text") or config.get("subtitle", "Emma & Noah"),
        "date_text": date_block.get("text") or config.get("date", "September 22, 2026"),
        "location_text": location_block.get("text") or config.get("locationName", "New York, USA"),
        "pdf_filename": pdf_filename,
        "pdf_size_bytes": len(pdf_bytes),
    }

    # 4. Append to orders.json
    orders = get_all_orders()
    orders.insert(0, order_record)
    ORDERS_JSON.write_text(json.dumps(orders, indent=2), encoding="utf-8")

    return order_record
