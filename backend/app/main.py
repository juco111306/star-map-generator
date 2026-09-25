"""
FastAPI application for Custom Star Map Generator.
"""
from datetime import datetime
import json
from typing import Any, Dict, List, Optional
import urllib.parse

from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel, Field

from app.astronomy import calculate_celestial_sphere, init_astronomy
from app.geocoding import search_location
from app.orders import (
    OrderCreateRequest,
    create_order,
    get_all_orders,
    get_order_by_id,
    get_order_pdf_path,
    get_orders_by_email,
    get_order_by_id_and_email,
    update_order_status,
    dispatch_order_to_gelato,
)
from app.pdf_generator import STYLE_CONFIGS, generate_star_map_pdf, register_fonts

app = FastAPI(title="Custom Star Map API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Warm up astronomy data and fonts on startup."""
    init_astronomy()
    register_fonts()


class StarDataRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    date_time: str = Field(..., description="ISO 8601 formatted datetime string")
    max_magnitude: Optional[float] = 6.0


class GeneratePDFRequest(BaseModel):
    latitude: float = Field(40.7128, ge=-90.0, le=90.0)
    longitude: float = Field(-74.0060, ge=-180.0, le=180.0)
    date_time: str = Field(..., description="ISO 8601 datetime")
    poster_size: str = Field("50x70", description="'20x30', '30x40', '40x50', '50x70', '18x24', '24x36'")
    style_id: str = Field("midnight_classic")
    mask_shape: Optional[str] = Field("circle")
    maskShape: Optional[str] = Field(None)

    # Structured text blocks
    titleBlock: Optional[Dict[str, Any]] = None
    namesBlock: Optional[Dict[str, Any]] = None
    taglineBlock: Optional[Dict[str, Any]] = None
    dateBlock: Optional[Dict[str, Any]] = None
    locationBlock: Optional[Dict[str, Any]] = None
    coordsBlock: Optional[Dict[str, Any]] = None

    # Legacy flat fallback fields
    font_family: Optional[str] = Field("Playfair Display")
    title_font: Optional[str] = Field(None)
    title_font_size: float = Field(38.0, ge=16.0, le=100.0)
    subtitle_font: Optional[str] = Field(None)
    subtitle_font_size: float = Field(26.0, ge=10.0, le=100.0)
    footer_font: Optional[str] = Field(None)
    footer_font_size: float = Field(15.0, ge=8.0, le=80.0)
    main_title: Optional[str] = Field("The Night We Met")
    subtitle: Optional[str] = Field("")
    footer_text: Optional[str] = Field("")

    # Display Toggles
    show_matted_border: Optional[bool] = Field(False)
    show_celestial_grid: Optional[bool] = Field(True)
    show_constellation_lines: Optional[bool] = Field(True)
    show_milky_way: Optional[bool] = Field(True)
    divider_style: Optional[str] = Field("diamond")
    divider_size: Optional[float] = Field(34.0, ge=6.0, le=80.0)
    dividerSize: Optional[float] = Field(None)
    frame_style: Optional[str] = Field("none")
    layout_variation: Optional[str] = Field("standard_stack")
    layoutVariation: Optional[str] = Field(None)

    class Config:
        extra = "allow"




@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Custom Star Map Generator"}


@app.get("/api/styles")
def get_styles():
    """Return all 10 available design styles."""
    return list(STYLE_CONFIGS.values())


@app.get("/api/geocode")
async def geocode(q: str = Query(..., min_length=1)):
    """Search for locations using multi-tier geocoding."""
    results = await search_location(q)
    return results



@app.post("/api/star-data")
def star_data(req: StarDataRequest):
    """Compute celestial sphere projection for the given coordinates and datetime."""
    try:
        dt = datetime.fromisoformat(req.date_time.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ISO 8601 date_time format")

    try:
        data = calculate_celestial_sphere(
            latitude=req.latitude,
            longitude=req.longitude,
            dt=dt,
            max_magnitude=req.max_magnitude or 6.0,
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-pdf")
def generate_pdf(req: GeneratePDFRequest):
    """Generate and return print-ready 300 DPI PDF."""
    try:
        dt = datetime.fromisoformat(req.date_time.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid ISO 8601 date_time format")

    params = req.dict()
    params["date_time"] = dt

    try:
        pdf_bytes = generate_star_map_pdf(params)
        filename = f"star-map-{req.style_id}-{req.poster_size}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Length": str(len(pdf_bytes)),
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation error: {str(e)}")


@app.post("/api/orders")
def api_create_order(req: OrderCreateRequest):
    """
    Create a new customer gift order, compile 300 DPI PDF,
    and archive into the print producer queue.
    """
    try:
        order = create_order(req)
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Order creation failed: {str(e)}")


@app.get("/api/orders")
def api_get_orders():
    """Retrieve all submitted print orders for the producer workshop."""
    try:
        return get_all_orders()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/orders/{order_id}")
def api_get_order(order_id: str):
    """Retrieve single order details."""
    order = get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.get("/api/orders/{order_id}/pdf")
def api_download_order_pdf(order_id: str):
    """
    Download the 300 DPI print-ready PDF for this order
    to send to the printing producer.
    """
    pdf_path = get_order_pdf_path(order_id)
    if not pdf_path or not pdf_path.exists():
        raise HTTPException(status_code=404, detail="Print PDF for this order was not found")

    pdf_bytes = pdf_path.read_bytes()
    filename = f"{order_id}_print_ready_300dpi.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )


class TrackOrderRequest(BaseModel):
    order_id: str = Field(..., description="Order ID like STL-19565 or 19565")
    email: str = Field(..., description="Customer email address")


class CustomerHistoryRequest(BaseModel):
    email: str = Field(..., description="Customer email address")


class UpdateOrderStatusRequest(BaseModel):
    status: str = Field(..., description="Status: confirmed, in_production, printed, shipped, delivered")
    carrier: Optional[str] = Field(None, description="Carrier name, e.g. PostNL or Bpost")
    tracking_number: Optional[str] = Field(None, description="Parcel tracking number")
    note: Optional[str] = Field(None, description="Optional custom timeline event note")


@app.post("/api/customer/orders/track")
def customer_track_order(req: TrackOrderRequest):
    """
    Look up a single order by order reference and matching customer email.
    Returns complete tracking progress, status timeline, and poster specs.
    """
    order = get_order_by_id_and_email(req.order_id, req.email)
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Geen bestelling gevonden voor dit bestelnummer en e-mailadres. Controleer uw invoer.",
        )
    return order


@app.post("/api/customer/orders/history")
def customer_order_history(req: CustomerHistoryRequest):
    """
    Look up all past orders associated with a customer's email address.
    """
    orders = get_orders_by_email(req.email)
    return {
        "email": req.email.strip().lower(),
        "count": len(orders),
        "orders": orders,
    }


@app.get("/api/customer/orders/{order_id}/pdf")
def customer_download_pdf(order_id: str, email: str = Query(..., description="Customer email for verification")):
    """
    Download print-ready PDF with customer email verification.
    """
    order = get_order_by_id_and_email(order_id, email)
    if not order:
        raise HTTPException(
            status_code=403,
            detail="Onbevoegd: Dit bestelnummer hoort niet bij het opgegeven e-mailadres.",
        )

    pdf_path = get_order_pdf_path(order_id)
    if not pdf_path or not pdf_path.exists():
        raise HTTPException(status_code=404, detail="Print PDF voor deze bestelling is niet gevonden.")

    pdf_bytes = pdf_path.read_bytes()
    filename = f"{order['order_id']}_stellaire_sterrenkaart.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )


@app.patch("/api/orders/{order_id}/status")
def api_update_order_status(order_id: str, req: UpdateOrderStatusRequest):
    """
    Update order status and append a milestone event to the customer tracking timeline.
    """
    updated = update_order_status(
        order_id=order_id,
        new_status=req.status,
        carrier=req.carrier,
        tracking_number=req.tracking_number,
        note=req.note,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated


@app.post("/api/orders/{order_id}/gelato-submit")
def api_submit_to_gelato(order_id: str):
    """
    Dispatch an existing order's 300 DPI PDF and customer shipping address to Gelato.
    """
    result = dispatch_order_to_gelato(order_id)
    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error") or "Fout bij het verzenden van de order naar Gelato",
        )
    return result


@app.post("/api/webhook/gelato")
async def api_gelato_webhook(request: Request):
    """
    Handle Gelato print and shipment status webhooks to update the customer tracking timeline.
    """
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    order_ref = data.get("orderReferenceId") or data.get("order_reference_id")
    if not order_ref:
        return {"received": True, "message": "No orderReferenceId in webhook"}

    status = (data.get("fulfillmentStatus") or data.get("status") or "").lower()
    tracking_code = data.get("trackingCode") or data.get("tracking_number") or ""
    carrier = data.get("carrier") or data.get("carrier_name") or "PostNL"

    # Map Gelato statuses to our customer timeline statuses
    new_status = "in_production"
    note = None
    if "ship" in status or tracking_code:
        new_status = "shipped"
        note = f"Gelato heeft het pakket overgedragen aan {carrier}."
    elif "print" in status or "produced" in status:
        new_status = "printed"
        note = "Poster is gedrukt door Gelato en doorstaat kwaliteitscontrole."
    elif "deliver" in status:
        new_status = "delivered"
        note = "Pakket is succesvol bezorgd."

    update_order_status(
        order_id=order_ref,
        new_status=new_status,
        carrier=carrier,
        tracking_number=tracking_code,
        note=note,
    )

    return {"received": True, "orderReferenceId": order_ref, "status": new_status}



