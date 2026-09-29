"""
High-resolution 300 DPI PDF generator for Custom Star Maps using ReportLab.
Curated fine-art aesthetics:
- 5 distinct artisan styles
- Complete typography customization: Title, Names, Date, Location, Coordinates
  (each with independent font family, font size, tracking, and styling)
- Realistic Milky Way stardust nebula overlay
- Delicate celestial coordinate rings & zenith crosshair
- Double celestial compass dial with degree ticks & cardinal points (N, S, E, W)
- Museum-grade gallery matted border (passepartout) with inner keyline
- Pure vector divider ornaments (Diamond, Star, Heart, Dot, Line) with dynamic sizing
"""
from datetime import datetime, timezone
from io import BytesIO
import math
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

from app.astronomy import calculate_celestial_sphere
from app.celestial_art import get_milky_way_texture
from app.watercolor import get_teal_watercolor_image

FONTS_DIR = Path(__file__).resolve().parent.parent / "fonts"

FONT_MAP = {
    "Playfair Display": "PlayfairDisplay",
    "Montserrat": "Montserrat",
    "Cinzel": "Cinzel",
    "Great Vibes": "GreatVibes",
    "Lato": "Lato",
}

_fonts_registered = False


def register_fonts():
    """Register Google Fonts TTF files with ReportLab."""
    global _fonts_registered
    if _fonts_registered:
        return

    for font_file in FONTS_DIR.glob("*.ttf"):
        font_name = font_file.stem
        try:
            pdfmetrics.registerFont(TTFont(font_name, str(font_file)))
        except Exception as e:
            print(f"Warning: Could not register font {font_name}: {e}")

    _fonts_registered = True


def resolve_font(requested_font: Optional[str], default_font: str = "PlayfairDisplay") -> str:
    """Safely map friendly font name to registered ReportLab font name."""
    if not requested_font:
        return default_font
    return FONT_MAP.get(requested_font, default_font)


def parse_color(c_str: str) -> Color:
    """Parse hex or rgba string into ReportLab Color."""
    if not c_str:
        return HexColor("#000000")
    c_str = c_str.strip()
    if c_str.startswith("#"):
        return HexColor(c_str)
    if c_str.startswith("rgba"):
        inner = c_str[c_str.find("(") + 1 : c_str.find(")")]
        parts = [p.strip() for p in inner.split(",")]
        r = float(parts[0]) / 255.0
        g = float(parts[1]) / 255.0
        b = float(parts[2]) / 255.0
        a = float(parts[3])
        return Color(r, g, b, alpha=a)
    if c_str.startswith("rgb"):
        inner = c_str[c_str.find("(") + 1 : c_str.find(")")]
        parts = [p.strip() for p in inner.split(",")]
        r = float(parts[0]) / 255.0
        g = float(parts[1]) / 255.0
        b = float(parts[2]) / 255.0
        return Color(r, g, b, alpha=1.0)
    return HexColor("#000000")


STYLE_CONFIGS = {
    "midnight_classic": {
        "id": "midnight_classic",
        "name": "Midnight Classic",
        "bg_color": "#0B132B",
        "map_bg_color": "#060D1E",
        "star_color": "#FFFFFF",
        "constellation_color": "rgba(255, 255, 255, 0.35)",
        "mask_shape": "circle",
        "border_color": "rgba(255, 255, 255, 0.45)",
        "ring_color": "rgba(255, 255, 255, 0.25)",
        "border_width": 1.5,
        "text_color": "#FFFFFF",
        "subtitle_color": "rgba(255, 255, 255, 0.85)",
        "footer_color": "rgba(255, 255, 255, 0.65)",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": False,
    },
    "vintage_monochrome": {
        "id": "vintage_monochrome",
        "name": "Vintage Monochrome",
        "bg_color": "#050505",
        "map_bg_color": "#000000",
        "star_color": "#FFFFFF",
        "constellation_color": "rgba(255, 255, 255, 0.42)",
        "mask_shape": "circle",
        "border_color": "#FFFFFF",
        "ring_color": "rgba(255, 255, 255, 0.32)",
        "border_width": 1.5,
        "text_color": "#FFFFFF",
        "subtitle_color": "#E2E2E2",
        "footer_color": "#A8A8A8",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": False,
    },
    "minimalist_light": {
        "id": "minimalist_light",
        "name": "Minimalist Light",
        "bg_color": "#FAFAFA",
        "map_bg_color": "#FFFFFF",
        "star_color": "#262626",
        "constellation_color": "rgba(38, 38, 38, 0.40)",
        "mask_shape": "circle",
        "border_color": "#262626",
        "ring_color": "rgba(38, 38, 38, 0.22)",
        "border_width": 1.2,
        "text_color": "#171717",
        "subtitle_color": "#4A4A4A",
        "footer_color": "#737373",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": False,
    },
    "teal_watercolor": {
        "id": "teal_watercolor",
        "name": "Teal Watercolor",
        "bg_color": "#F5F7F6",
        "map_bg_color": "#083B44",
        "star_color": "#FFFFFF",
        "constellation_color": "rgba(255, 255, 255, 0.40)",
        "mask_shape": "circle",
        "border_color": "#0C4B56",
        "ring_color": "rgba(12, 75, 86, 0.3)",
        "border_width": 1.5,
        "text_color": "#083B44",
        "subtitle_color": "#1A5A66",
        "footer_color": "#3B7580",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": True,
    },
    "emerald_night": {
        "id": "emerald_night",
        "name": "Emerald Night",
        "bg_color": "#081C15",
        "map_bg_color": "#04110C",
        "star_color": "#D4AF37",
        "constellation_color": "rgba(212, 175, 55, 0.42)",
        "mask_shape": "circle",
        "border_color": "#D4AF37",
        "ring_color": "rgba(212, 175, 55, 0.3)",
        "border_width": 1.5,
        "text_color": "#D4AF37",
        "subtitle_color": "#F3E5AB",
        "footer_color": "#C9B06B",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": False,
    },
    "burgundy_sky": {
        "id": "burgundy_sky",
        "name": "Burgundy Sky",
        "bg_color": "#38070E",
        "map_bg_color": "#240308",
        "star_color": "#FFFFFF",
        "constellation_color": "rgba(255, 235, 238, 0.36)",
        "mask_shape": "circle",
        "border_color": "rgba(255, 235, 238, 0.4)",
        "ring_color": "rgba(255, 235, 238, 0.22)",
        "border_width": 1.5,
        "text_color": "#FFFFFF",
        "subtitle_color": "#F7D6DA",
        "footer_color": "#D6A6AD",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": False,
    },
    "the_heart_navy": {
        "id": "the_heart_navy",
        "name": "The Heart (Navy)",
        "bg_color": "#0B132B",
        "map_bg_color": "#060D1E",
        "star_color": "#FFFFFF",
        "constellation_color": "rgba(255, 255, 255, 0.36)",
        "mask_shape": "heart",
        "border_color": "rgba(255, 255, 255, 0.45)",
        "ring_color": "rgba(255, 255, 255, 0.2)",
        "border_width": 1.5,
        "text_color": "#FFFFFF",
        "subtitle_color": "rgba(255, 255, 255, 0.85)",
        "footer_color": "rgba(255, 255, 255, 0.65)",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": False,
    },
    "the_heart_teal": {
        "id": "the_heart_teal",
        "name": "The Heart (Teal)",
        "bg_color": "#F5F7F6",
        "map_bg_color": "#083B44",
        "star_color": "#FFFFFF",
        "constellation_color": "rgba(255, 255, 255, 0.40)",
        "mask_shape": "heart",
        "border_color": "#0C4B56",
        "ring_color": "rgba(12, 75, 86, 0.25)",
        "border_width": 1.5,
        "text_color": "#083B44",
        "subtitle_color": "#1A5A66",
        "footer_color": "#3B7580",
        "curved_text": False,
        "constellations_only": False,
        "is_watercolor": True,
    },
    "border_text": {
        "id": "border_text",
        "name": "Border Text",
        "bg_color": "#0B132B",
        "map_bg_color": "#060D1E",
        "star_color": "#FFFFFF",
        "constellation_color": "rgba(255, 255, 255, 0.35)",
        "mask_shape": "circle",
        "border_color": "rgba(255, 255, 255, 0.45)",
        "ring_color": "rgba(255, 255, 255, 0.25)",
        "border_width": 1.5,
        "text_color": "#FFFFFF",
        "subtitle_color": "rgba(255, 255, 255, 0.85)",
        "footer_color": "rgba(255, 255, 255, 0.65)",
        "curved_text": True,
        "constellations_only": False,
        "is_watercolor": False,
    },
    "constellations_only": {
        "id": "constellations_only",
        "name": "Constellations Only",
        "bg_color": "#050505",
        "map_bg_color": "#000000",
        "star_color": "#FFFFFF",
        "constellation_color": "#FFFFFF",
        "mask_shape": "circle",
        "border_color": "#FFFFFF",
        "ring_color": "rgba(255, 255, 255, 0.35)",
        "border_width": 1.5,
        "text_color": "#FFFFFF",
        "subtitle_color": "#E2E2E2",
        "footer_color": "#A8A8A8",
        "curved_text": False,
        "constellations_only": True,
        "is_watercolor": False,
    },
}


def _get_heart_points(cx: float, cy: float, radius: float, num_points: int = 240) -> List[Tuple[float, float]]:
    """Compute smooth polygon points for heart shape centered at (cx, cy)."""
    t = np.linspace(0, 2 * np.pi, num_points)
    x_raw = 16 * np.sin(t) ** 3
    y_raw = 13 * np.cos(t) - 5 * np.cos(2 * t) - 2 * np.cos(3 * t) - np.cos(4 * t)

    x_norm = x_raw / 16.0
    y_center = (np.max(y_raw) + np.min(y_raw)) / 2.0
    y_scale = (np.max(y_raw) - np.min(y_raw)) / 2.0
    y_norm = (y_raw - y_center) / y_scale

    points = []
    for xn, yn in zip(x_norm, y_norm):
        points.append((cx + xn * radius, cy + yn * radius))
    return points


def _draw_celestial_compass_ring(
    c: canvas.Canvas,
    cx: float,
    cy: float,
    radius: float,
    ring_color: Color,
    text_color: Color,
    scale: float,
    font_name: str,
    locale: str = "nl",
):
    """Draw astronomical double ring with degree ticks and cardinal points (N, S, E, W)."""
    outer_r = radius + 9.0 * scale
    c.saveState()
    c.setStrokeColor(ring_color)
    c.setLineWidth(0.65 * scale)

    # Outer concentric ring
    c.circle(cx, cy, outer_r, stroke=1, fill=0)

    # Degree tick marks every 10 degrees, with major ticks every 30 degrees
    for deg in range(0, 360, 10):
        rad = math.radians(deg)
        if deg in (0, 90, 180, 270):
            continue

        is_major = (deg % 30 == 0)
        tick_len = (6.5 if is_major else 3.5) * scale

        sin_a = math.sin(rad)
        cos_a = math.cos(rad)

        x1 = cx - radius * sin_a
        y1 = cy + radius * cos_a
        x2 = cx - (radius + tick_len) * sin_a
        y2 = cy + (radius + tick_len) * cos_a

        c.setLineWidth((0.75 if is_major else 0.5) * scale)
        c.line(x1, y1, x2, y2)

    # Cardinal directions
    c.setFont(font_name, 9.0 * scale)
    c.setFillColor(text_color)

    card_n = "N"
    card_s = "Z" if locale == "nl" else "S"
    card_e = "E" if locale == "en" else "O"
    card_w = "W"

    # In SVG: North is cy - radius - 12 (top)
    # South is cy + radius + 19 (bottom)
    # East is cx - radius - 15, y = cy + 3.5 (left)
    # West is cx + radius + 15, y = cy + 3.5 (right)
    # In ReportLab, Y increases upwards from bottom
    c.drawCentredString(cx, cy + radius + 12.0 * scale - 2.5 * scale, card_n)
    c.drawCentredString(cx, cy - radius - 19.0 * scale + 2.5 * scale, card_s)
    c.drawCentredString(cx - radius - 15.0 * scale, cy - 2.5 * scale, card_e)
    c.drawCentredString(cx + radius + 15.0 * scale, cy - 2.5 * scale, card_w)

    c.restoreState()


def _draw_curved_text(
    c: canvas.Canvas,
    text: str,
    cx: float,
    cy: float,
    radius: float,
    font_name: str,
    font_size: float,
    color: Color,
    tracking: float = 2.0,
):
    """Draw text curving along the upper outer perimeter of the circle with tracking."""
    c.saveState()
    c.setFont(font_name, font_size)
    c.setFillColor(color)

    char_widths = [pdfmetrics.stringWidth(ch, font_name, font_size) for ch in text]
    total_width = sum(char_widths) + (len(text) - 1) * tracking
    total_angle = total_width / radius

    # Center at the top (pi/2)
    current_angle = (math.pi / 2) + (total_angle / 2)

    c.translate(cx, cy)
    for i, (ch, w) in enumerate(zip(text, char_widths)):
        step_w = w + tracking
        ch_angle = current_angle - (step_w / (2 * radius))
        rot_deg = math.degrees(ch_angle) - 90

        c.saveState()
        c.rotate(rot_deg)
        c.drawString(-w / 2, radius, ch)
        c.restoreState()
        current_angle -= step_w / radius

    c.restoreState()


def _draw_centered_tracked_string(
    c: canvas.Canvas,
    cx: float,
    y: float,
    text: str,
    font_name: str,
    font_size: float,
    color: Color,
    tracking: float = 0.0,
):
    """Draw centered text with custom tracking / character spacing."""
    if not text:
        return

    c.saveState()
    c.setFont(font_name, font_size)
    c.setFillColor(color)

    raw_width = pdfmetrics.stringWidth(text, font_name, font_size)
    total_width = raw_width + (len(text) - 1) * tracking if len(text) > 1 else raw_width
    start_x = cx - total_width / 2.0

    t = c.beginText()
    t.setFont(font_name, font_size)
    t.setTextOrigin(start_x, y)
    t.setCharSpace(tracking)
    t.textOut(text)
    c.drawText(t)
    c.restoreState()


def _draw_divider(
    c: canvas.Canvas,
    cx: float,
    y: float,
    style: str,
    color: Color,
    scale: float,
    divider_size: float = 34.0,
    div_scale: Optional[float] = None,
):
    """Render chosen decorative divider ornament scaled proportionally with divider_size."""
    if style == "none":
        return

    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)

    if div_scale is None:
        div_scale = max(0.4, divider_size / 18.0)

    c.setLineWidth(max(0.5, 0.75 * div_scale) * scale)
    div_w = 55.0 * div_scale * scale

    if style == "diamond":
        inner_gap = 10.0 * div_scale * scale
        c.line(cx - div_w, y, cx - inner_gap, y)
        c.line(cx + inner_gap, y, cx + div_w, y)
        d_size = 3.5 * div_scale * scale
        p = c.beginPath()
        p.moveTo(cx, y + d_size)
        p.lineTo(cx + d_size, y)
        p.lineTo(cx, y - d_size)
        p.lineTo(cx - d_size, y)
        p.close()
        c.drawPath(p, stroke=0, fill=1)

    elif style == "star":
        inner_gap = 10.0 * div_scale * scale
        c.line(cx - div_w, y, cx - inner_gap, y)
        c.line(cx + inner_gap, y, cx + div_w, y)
        s_size = 4.5 * div_scale * scale
        p = c.beginPath()
        p.moveTo(cx, y + s_size * 1.3)
        p.lineTo(cx + s_size * 0.25, y + s_size * 0.25)
        p.lineTo(cx + s_size * 1.3, y)
        p.lineTo(cx + s_size * 0.25, y - s_size * 0.25)
        p.lineTo(cx, y - s_size * 1.3)
        p.lineTo(cx - s_size * 0.25, y - s_size * 0.25)
        p.lineTo(cx - s_size * 1.3, y)
        p.lineTo(cx - s_size * 0.25, y + s_size * 0.25)
        p.close()
        c.drawPath(p, stroke=0, fill=1)

    elif style == "heart":
        inner_gap = 10.0 * div_scale * scale
        c.line(cx - div_w, y, cx - inner_gap, y)
        c.line(cx + inner_gap, y, cx + div_w, y)
        h_pts = _get_heart_points(cx, y + 1.0 * scale * div_scale, 4.0 * scale * div_scale, num_points=60)
        p = c.beginPath()
        p.moveTo(h_pts[0][0], h_pts[0][1])
        for px, py in h_pts[1:]:
            p.lineTo(px, py)
        p.close()
        c.drawPath(p, stroke=0, fill=1)

    elif style == "dot":
        inner_gap = 8.0 * div_scale * scale
        c.line(cx - div_w, y, cx - inner_gap, y)
        c.line(cx + inner_gap, y, cx + div_w, y)
        c.circle(cx, y, 2.0 * scale * div_scale, stroke=0, fill=1)

    else:  # 'line'
        c.line(cx - div_w, y, cx + div_w, y)

    c.restoreState()


def _draw_moon_phases_row(
    c: canvas.Canvas,
    cx: float,
    cy: float,
    color: Color,
    scale: float,
):
    """
    Render 7 authentic astronomical moon phases directly beneath the star map:
    Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent.
    """
    c.saveState()

    # 7 phases parameters: (illumination factor k in [-1, 1], sign: +1 waxing/right, -1 waning/left, is_full)
    phases = [
        (-0.52, 1, False),   # Waxing Crescent
        (0.0, 1, False),     # First Quarter
        (0.52, 1, False),    # Waxing Gibbous
        (1.0, 1, True),      # Full Moon
        (0.52, -1, False),   # Waning Gibbous
        (0.0, -1, False),    # Last Quarter
        (-0.52, -1, False),  # Waning Crescent
    ]

    moon_radius = 15.0 * scale
    spacing = 48.0 * scale
    total_span = (len(phases) - 1) * spacing
    start_x = cx - total_span / 2.0

    # Faint connecting baseline matching StarMapPreview
    baseline_color = Color(color.red, color.green, color.blue, alpha=0.20)
    c.setStrokeColor(baseline_color)
    c.setLineWidth(0.5 * scale)
    c.line(cx - 3.8 * spacing, cy, cx + 3.8 * spacing, cy)

    for idx, (k, sign, is_full) in enumerate(phases):
        mx = start_x + idx * spacing

        # Subtle outer rim of the entire moon disc
        rim_color = Color(color.red, color.green, color.blue, alpha=0.35)
        c.setStrokeColor(rim_color)
        c.setLineWidth(0.75 * scale)
        c.circle(mx, cy, moon_radius, stroke=1, fill=0)

        # Illuminated portion
        c.setFillColor(color)
        if is_full:
            c.circle(mx, cy, moon_radius, stroke=0, fill=1)
        else:
            p = c.beginPath()
            steps = 24
            # 1. Outer circular limb: theta from pi/2 down to -pi/2
            first = True
            for j in range(steps + 1):
                theta = math.pi / 2.0 - math.pi * (j / steps)
                px = mx + sign * moon_radius * math.cos(theta)
                py = cy + moon_radius * math.sin(theta)
                if first:
                    p.moveTo(px, py)
                    first = False
                else:
                    p.lineTo(px, py)

            # 2. Inner terminator ellipse: phi from -pi/2 up to pi/2
            for j in range(steps + 1):
                phi = -math.pi / 2.0 + math.pi * (j / steps)
                px = mx + sign * k * moon_radius * math.cos(phi)
                py = cy + moon_radius * math.sin(phi)
                p.lineTo(px, py)

            p.close()
            c.drawPath(p, stroke=0, fill=1)

    c.restoreState()


def _calculate_canonical_layout(
    params: Dict[str, Any],
    vb_height: float,
    scale_factor: float,
    base_radius: float,
    base_cy: float,
    layout_variation: str,
    mask_shape: str,
    is_curved: bool,
    is_top_title: bool,
    is_moon_phases: bool,
    is_framed: bool,
) -> Dict[str, Any]:
    """Calculate 100% unified canonical geometry (width = 1000) identical to Studio preview."""
    cx = 500.0
    radius = base_radius
    cy = base_cy

    if is_top_title:
        radius = round(base_radius * 0.94)
        cy = round(vb_height * 0.47)
    elif is_moon_phases:
        radius = round(base_radius * 0.97)
        cy = base_cy - 20.0
    elif is_curved:
        radius = round(base_radius * 0.98)
        cy = base_cy + round(75.0 * scale_factor)
    elif is_framed:
        radius = round(base_radius * 0.98)
        cy = base_cy

    if mask_shape == "heart":
        radius = radius * 0.94

    title_block = params.get("titleBlock") or {}
    names_block = params.get("namesBlock") or {}
    date_block = params.get("dateBlock") or {}
    coords_block = params.get("coordsBlock") or {}

    title_enabled = bool(title_block.get("enabled", True)) and bool(str(title_block.get("text", "")).strip())
    names_enabled = bool(names_block.get("enabled", True)) and bool(str(names_block.get("text", "")).strip())
    date_enabled = bool(date_block.get("enabled", True)) and bool(str(date_block.get("text", "")).strip())
    loc_enabled = (
        bool(params.get("locationBlock", {}).get("enabled", True) and str(params.get("locationBlock", {}).get("text", "")).strip())
        or bool(coords_block.get("enabled", True) and str(coords_block.get("text", "")).strip())
        or bool(params.get("location_text") or params.get("footer_text") or params.get("coords_text"))
    )

    divider_style = str(params.get("divider_style") or params.get("dividerStyle") or "diamond")
    div_base_size = float(params.get("divider_size") or params.get("dividerSize") or 34.0)
    div_scale = (div_base_size / 18.0) * scale_factor
    divider_half_h = 4.5 * div_scale if divider_style != "none" else 0.0

    eff_title_size = float(title_block.get("size", 38)) * (0.74 if is_curved else 0.78) * scale_factor
    title_ascender = eff_title_size * 0.72

    eff_names_size = float(names_block.get("size", 51)) * 0.85 * scale_factor
    names_ascender = eff_names_size * 0.72

    d_size = float(date_block.get("size", 27)) if date_enabled else 27.0
    eff_date_size = d_size * 0.85 * scale_factor
    date_ascender = eff_date_size * 0.72

    c_size = float(coords_block.get("size", 21)) if coords_block else 21.0
    eff_coord_size = c_size * 0.85 * scale_factor
    coords_ascender = eff_coord_size * 0.72

    positions = {
        "cx": cx,
        "cy": cy,
        "radius": radius,
        "titleY": 0.0,
        "namesY": 0.0,
        "dividerY": 0.0,
        "moonPhasesY": 0.0,
        "dateY": 0.0,
        "locY": 0.0,
        "eff_title_size": eff_title_size,
        "eff_names_size": eff_names_size,
        "eff_date_size": eff_date_size,
        "eff_coord_size": eff_coord_size,
        "div_scale": div_scale,
    }

    if is_top_title:
        clearance_above = 45.0 * scale_factor
        positions["titleY"] = (cy - radius) - clearance_above

        curr_y = cy + radius + 52.0 * scale_factor
        if names_enabled:
            positions["namesY"] = curr_y + names_ascender
            curr_y = positions["namesY"] + (eff_names_size * 0.28 + 26.0) * scale_factor

        if divider_style != "none":
            positions["dividerY"] = curr_y + 12.0 * scale_factor + divider_half_h
            positions["dateY"] = positions["dividerY"] + divider_half_h + 16.0 * scale_factor + date_ascender
            curr_y = positions["dateY"] + (eff_date_size * 0.28 + 20.0) * scale_factor
        elif date_enabled:
            positions["dateY"] = curr_y + 14.0 * scale_factor + date_ascender
            curr_y = positions["dateY"] + (eff_date_size * 0.28 + 20.0) * scale_factor

        if loc_enabled:
            positions["locY"] = curr_y + coords_ascender

        return positions

    if is_moon_phases:
        positions["moonPhasesY"] = cy + radius + 40.0 * scale_factor
        moons_bottom = positions["moonPhasesY"] + 15.0 * scale_factor

        title_top = moons_bottom + 32.0 * scale_factor
        after_title_y = title_top
        if title_enabled:
            positions["titleY"] = title_top + title_ascender
            after_title_y = positions["titleY"] + (eff_title_size * 0.28 + 24.0) * scale_factor

        if names_enabled:
            positions["namesY"] = after_title_y + names_ascender
            after_title_y = positions["namesY"] + (eff_names_size * 0.28 + 20.0) * scale_factor

        base_divider_y = positions["moonPhasesY"] + 200.0 * scale_factor
        positions["dividerY"] = max(base_divider_y, after_title_y + 12.0 * scale_factor + divider_half_h)

        curr_y = positions["dividerY"]
        if divider_style != "none":
            positions["dateY"] = positions["dividerY"] + divider_half_h + 16.0 * scale_factor + date_ascender
            curr_y = positions["dateY"] + (eff_date_size * 0.28 + 18.0) * scale_factor
        elif date_enabled:
            positions["dateY"] = positions["dividerY"] + 14.0 * scale_factor + date_ascender
            curr_y = positions["dateY"] + (eff_date_size * 0.28 + 18.0) * scale_factor

        if loc_enabled:
            positions["locY"] = curr_y + coords_ascender

        return positions

    if is_curved:
        curr_y = cy + radius + 52.0 * scale_factor
        if names_enabled:
            positions["namesY"] = curr_y + names_ascender
            curr_y = positions["namesY"] + (eff_names_size * 0.28 + 24.0) * scale_factor

        if divider_style != "none":
            positions["dividerY"] = curr_y + 10.0 * scale_factor + divider_half_h
            positions["dateY"] = positions["dividerY"] + divider_half_h + 16.0 * scale_factor + date_ascender
            curr_y = positions["dateY"] + (eff_date_size * 0.28 + 18.0) * scale_factor
        elif date_enabled:
            positions["dateY"] = curr_y + 14.0 * scale_factor + date_ascender
            curr_y = positions["dateY"] + (eff_date_size * 0.28 + 18.0) * scale_factor

        if loc_enabled:
            positions["locY"] = curr_y + coords_ascender

        return positions

    # Standard Stack and Framed layout:
    # Strictly locked constant clearance from bottom of circle to the top of title letters
    title_top = cy + radius + 50.0 * scale_factor
    curr_y = title_top

    if title_enabled:
        positions["titleY"] = title_top + title_ascender
        curr_y = positions["titleY"] + (eff_title_size * 0.28 + 26.0) * scale_factor

    if names_enabled:
        positions["namesY"] = curr_y + names_ascender
        curr_y = positions["namesY"] + (eff_names_size * 0.28 + 24.0) * scale_factor

    if divider_style != "none":
        positions["dividerY"] = curr_y + 12.0 * scale_factor + divider_half_h
        positions["dateY"] = positions["dividerY"] + divider_half_h + 16.0 * scale_factor + date_ascender
        curr_y = positions["dateY"] + (eff_date_size * 0.28 + 18.0) * scale_factor
    elif date_enabled:
        positions["dateY"] = curr_y + 14.0 * scale_factor + date_ascender
        curr_y = positions["dateY"] + (eff_date_size * 0.28 + 18.0) * scale_factor

    if loc_enabled:
        positions["locY"] = curr_y + coords_ascender

    return positions


def generate_star_map_pdf(params: Dict[str, Any]) -> bytes:
    """Generate high-resolution 300 DPI print-ready PDF with all individual controls."""
    register_fonts()

    # Poster dimensions (72 points per inch, 28.346 pt per cm)
    poster_size = str(params.get("poster_size") or params.get("posterSize") or "50x70")
    if poster_size == "30x40":
        page_width = 850.39
        page_height = 1133.86
        vb_height = 1333.33
        scale_factor = 1.0
        base_radius = 391.0
        base_cy = 470.0
    elif poster_size == "40x50":
        page_width = 1133.86
        page_height = 1417.32
        vb_height = 1250.0
        scale_factor = 1.05
        base_radius = 385.0
        base_cy = 445.0
    elif poster_size == "50x70":
        page_width = 1417.32
        page_height = 1984.25
        vb_height = 1400.0
        scale_factor = 1.15
        base_radius = 410.0
        base_cy = 485.0
    elif poster_size == "12x18":
        page_width = 864.0
        page_height = 1296.0
        vb_height = 1500.0
        scale_factor = 1.0
        base_radius = 435.0
        base_cy = 525.0
    elif poster_size == "24x36":
        page_width = 1728.0
        page_height = 2592.0
        vb_height = 1500.0
        scale_factor = 1.25
        base_radius = 435.0
        base_cy = 525.0
    else:  # default '18x24' inches = 1296 x 1728 pt
        page_width = 1296.0
        page_height = 1728.0
        vb_height = 1333.33
        scale_factor = 1.0
        base_radius = 391.0
        base_cy = 470.0

    # Scale proportionally tied to canonical width 1000
    canonical_scale = page_width / 1000.0
    scale = canonical_scale

    # Resolve style configuration
    style_id = str(params.get("style_id") or params.get("styleId") or "midnight_classic")
    style = STYLE_CONFIGS.get(style_id, STYLE_CONFIGS["midnight_classic"])

    # Extract text blocks
    # Support both new structured blocks and legacy flat parameters
    title_block = params.get("titleBlock") or {
        "text": params.get("main_title") or "THE NIGHT WE MET",
        "font": params.get("title_font") or params.get("font_family") or "Cinzel",
        "size": params.get("title_font_size", 38),
        "tracking": params.get("title_tracking", 3),
        "uppercase": True,
        "enabled": True,
    }
    names_block = params.get("namesBlock") or {
        "text": params.get("subtitle") or "Emma & Noah",
        "font": params.get("subtitle_font") or params.get("font_family") or "Great Vibes",
        "size": params.get("subtitle_font_size", 51),
        "tracking": 1,
        "uppercase": False,
        "enabled": bool(params.get("subtitle")),
    }
    tagline_block = params.get("taglineBlock") or {
        "text": params.get("tagline") or "",
        "font": "Playfair Display",
        "size": 13,
        "tracking": 1,
        "uppercase": False,
        "enabled": False,
    }
    date_block = params.get("dateBlock") or {
        "text": params.get("date_text") or "SEPTEMBER 22, 2026",
        "font": params.get("footer_font") or params.get("font_family") or "Montserrat",
        "size": params.get("footer_font_size", 27.0),
        "tracking": 2,
        "uppercase": True,
        "enabled": True,
    }
    location_block = params.get("locationBlock") or {
        "text": params.get("location_text") or (params.get("footer_text") or "").split("•")[0].strip(),
        "font": params.get("footer_font") or params.get("font_family") or "Montserrat",
        "size": 21,
        "tracking": 2,
        "uppercase": True,
        "enabled": True,
    }
    coords_block = params.get("coordsBlock") or {
        "text": params.get("coords_text") or (
            params.get("footer_text", "").split("•")[1].strip()
            if "•" in params.get("footer_text", "")
            else ""
        ),
        "font": "Montserrat",
        "size": 21,
        "tracking": 2,
        "uppercase": True,
        "enabled": True,
    }

    # Display Toggles
    show_matted_border = bool(params.get("show_matted_border", False))
    show_celestial_grid = bool(params.get("show_celestial_grid", True))
    show_constellation_lines = bool(params.get("show_constellation_lines", True))
    show_milky_way = bool(params.get("show_milky_way", True))
    divider_style = params.get("divider_style", "diamond")

    # Layout variation flags
    layout_variation = (
        params.get("layout_variation")
        or params.get("layoutVariation")
        or "standard_stack"
    )
    is_curved = (layout_variation == "curved_border") or bool(style.get("curved_text"))
    is_top_title = (layout_variation == "top_title")
    is_moon_phases = (layout_variation == "moon_phases")
    is_framed = (layout_variation == "framed")

    mask_shape = (
        params.get("mask_shape")
        or params.get("maskShape")
        or style.get("mask_shape", "circle")
    )

    # Compute 100% synchronized canonical layout geometry
    layout = _calculate_canonical_layout(
        params=params,
        vb_height=vb_height,
        scale_factor=scale_factor,
        base_radius=base_radius,
        base_cy=base_cy,
        layout_variation=layout_variation,
        mask_shape=mask_shape,
        is_curved=is_curved,
        is_top_title=is_top_title,
        is_moon_phases=is_moon_phases,
        is_framed=is_framed,
    )

    # Celestial calculations
    raw_dt = params.get("date_time")
    if isinstance(raw_dt, str):
        try:
            dt_obj = datetime.fromisoformat(raw_dt.replace("Z", "+00:00"))
        except Exception:
            dt_obj = datetime(2026, 9, 22, 21, 0, tzinfo=timezone.utc)
    elif isinstance(raw_dt, datetime):
        dt_obj = raw_dt
    else:
        dt_obj = datetime(2026, 9, 22, 21, 0, tzinfo=timezone.utc)

    celestial_data = calculate_celestial_sphere(
        latitude=float(params.get("latitude", 40.7128)),
        longitude=float(params.get("longitude", -74.0060)),
        dt=dt_obj,
    )

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=(page_width, page_height))
    c.setTitle(f"Custom Star Map - {title_block.get('text', '')}")

    # 1. Outer Background Fill
    bg_color = parse_color(style["bg_color"])
    c.setFillColor(bg_color)
    c.rect(0, 0, page_width, page_height, stroke=0, fill=1)

    # 2. Museum Gallery Matted Border (Passepartout) if enabled
    is_large = poster_size in ("24x36", "50x70")
    mat_margin = (38.0 if is_large else 34.0) * canonical_scale
    frame_margin = (54.0 if is_large else 44.0) * canonical_scale

    if show_matted_border:
        c.saveState()
        # White mat frame
        c.setFillColor(HexColor("#FFFFFF"))
        c.rect(0, page_height - mat_margin, page_width, mat_margin, stroke=0, fill=1)
        c.rect(0, 0, page_width, mat_margin, stroke=0, fill=1)
        c.rect(0, 0, mat_margin, page_height, stroke=0, fill=1)
        c.rect(page_width - mat_margin, 0, mat_margin, page_height, stroke=0, fill=1)

        # Fine inner keyline framing
        c.setStrokeColor(HexColor("#CCCCCC"))
        c.setLineWidth(0.65 * canonical_scale)
        c.rect(mat_margin, mat_margin, page_width - 2 * mat_margin, page_height - 2 * mat_margin, stroke=1, fill=0)
        c.restoreState()

    # 3. Celestial Map Position & Geometry in PDF points
    cx = layout["cx"] * canonical_scale
    cy = page_height - (layout["cy"] * canonical_scale)
    radius = layout["radius"] * canonical_scale

    # Delicate Passe-Partout Keyline for the "Framed" Layout
    if is_framed and not show_matted_border:
        c.saveState()
        frame_stroke_color = parse_color(style.get("border_color", "#1C1917"))
        c.setStrokeColor(frame_stroke_color)
        c.setLineWidth(0.85 * canonical_scale)
        c.rect(frame_margin, frame_margin, page_width - 2 * frame_margin, page_height - 2 * frame_margin, stroke=1, fill=0)
        c.restoreState()

    # 4. Draw Celestial Map inside clipping mask
    c.saveState()
    clip_path = c.beginPath()

    if mask_shape == "heart":
        heart_pts = _get_heart_points(cx, cy, radius)
        clip_path.moveTo(heart_pts[0][0], heart_pts[0][1])
        for hx, hy in heart_pts[1:]:
            clip_path.lineTo(hx, hy)
        clip_path.close()
    else:  # circle
        clip_path.circle(cx, cy, radius)

    c.clipPath(clip_path, stroke=0, fill=0)

    # Map background fill inside mask
    if style.get("is_watercolor"):
        tex_path = get_teal_watercolor_image(1600, 1600)
        c.drawImage(
            tex_path,
            cx - radius * 1.15,
            cy - radius * 1.15,
            width=radius * 2.3,
            height=radius * 2.3,
            mask=None,
        )
    else:
        map_bg_color = parse_color(style["map_bg_color"])
        c.setFillColor(map_bg_color)
        c.rect(cx - radius - 60, cy - radius - 60, (radius + 60) * 2, (radius + 60) * 2, stroke=0, fill=1)

    # Milky Way Stardust Nebula Overlay (if enabled)
    if show_milky_way and not style.get("is_watercolor") and not style.get("constellations_only"):
        try:
            mw_path = get_milky_way_texture(1600, 1600)
            c.saveState()
            c.drawImage(
                mw_path,
                cx - radius * 1.05,
                cy - radius * 1.05,
                width=radius * 2.1,
                height=radius * 2.1,
                mask="auto",
            )
            c.restoreState()
        except Exception as e:
            print("Milky Way draw warning:", e)

    # Delicate Celestial Equator and Coordinate Rings
    if show_celestial_grid:
        c.saveState()
        c.setStrokeColor(parse_color(style.get("ring_color", "rgba(255,255,255,0.2)")))
        c.setLineWidth(0.5 * scale)
        # Celestial Equator circle
        c.circle(cx, cy, radius * 0.65, stroke=1, fill=0)
        # Subtle Zenith Crosshair
        ch_len = 8.0 * scale
        c.line(cx - ch_len, cy, cx + ch_len, cy)
        c.line(cx, cy - ch_len, cx, cy + ch_len)
        c.restoreState()

    # Constellation lines (if enabled)
    if show_constellation_lines:
        constellation_color = parse_color(style["constellation_color"])
        c.setStrokeColor(constellation_color)
        c.setLineWidth(float(style.get("constellation_width", 0.72 * scale)))

        for line in celestial_data["lines"]:
            p1, p2 = line["p1"], line["p2"]
            x1 = cx + p1[0] * radius
            y1 = cy + p1[1] * radius
            x2 = cx + p2[0] * radius
            y2 = cy + p2[1] * radius
            c.line(x1, y1, x2, y2)

    # Stars rendering with magnitude-based size and alpha glow
    star_color = parse_color(style["star_color"])

    if style.get("constellations_only"):
        # Style 10: Constellations only
        c.setFillColor(star_color)
        for s in celestial_data["constellation_stars"]:
            sx = cx + s["x"] * radius
            sy = cy + s["y"] * radius
            sr = max(1.4 * scale, s["size"] * 0.95 * scale)
            c.circle(sx, sy, sr, stroke=0, fill=1)
    else:
        # All visible stars with depth
        for s in celestial_data["stars"]:
            sx = cx + s["x"] * radius
            sy = cy + s["y"] * radius
            mag = s["mag"]

            # Bright stars (mag < 2.0) get a radiant outer soft halo
            if mag < 2.0:
                c.saveState()
                halo_color = Color(star_color.red, star_color.green, star_color.blue, alpha=0.25)
                c.setFillColor(halo_color)
                c.circle(sx, sy, s["size"] * 2.0 * scale, stroke=0, fill=1)
                c.restoreState()

            # Star core
            c.saveState()
            alpha = 1.0 if mag < 3.5 else 0.75
            core_color = Color(star_color.red, star_color.green, star_color.blue, alpha=alpha)
            c.setFillColor(core_color)
            sr = max(0.55 * scale, s["size"] * 0.85 * scale)
            c.circle(sx, sy, sr, stroke=0, fill=1)
            c.restoreState()

    c.restoreState()

    # 5. Mask Boundary & Celestial Compass Ring
    border_color = parse_color(style["border_color"])
    border_width = float(style.get("border_width", 1.5)) * scale
    c.setStrokeColor(border_color)
    c.setLineWidth(border_width)

    if mask_shape == "heart":
        heart_pts = _get_heart_points(cx, cy, radius)
        b_path = c.beginPath()
        b_path.moveTo(heart_pts[0][0], heart_pts[0][1])
        for hx, hy in heart_pts[1:]:
            b_path.lineTo(hx, hy)
        b_path.close()
        c.drawPath(b_path, stroke=1, fill=0)

        # Secondary outer heart rim for luxury romantic depth
        heart_pts_outer = _get_heart_points(cx, cy, radius + 8.0 * scale)
        b_path_outer = c.beginPath()
        b_path_outer.moveTo(heart_pts_outer[0][0], heart_pts_outer[0][1])
        for hx, hy in heart_pts_outer[1:]:
            b_path_outer.lineTo(hx, hy)
        b_path_outer.close()
        c.setStrokeColor(parse_color(style.get("ring_color", "rgba(255,255,255,0.2)")))
        c.setLineWidth(0.65 * scale)
        c.drawPath(b_path_outer, stroke=1, fill=0)

    else:  # circle
        # Inner mask border
        c.circle(cx, cy, radius, stroke=1, fill=0)

        # Draw celestial compass ring with degree ticks if enabled
        if show_celestial_grid and not is_curved:
            ring_color = parse_color(style.get("ring_color", "rgba(255,255,255,0.25)"))
            _draw_celestial_compass_ring(
                c=c,
                cx=cx,
                cy=cy,
                radius=radius,
                ring_color=ring_color,
                text_color=parse_color(style["text_color"]),
                scale=scale,
                font_name=resolve_font(coords_block.get("font"), "Montserrat"),
                locale=str(params.get("locale", "nl")).lower(),
            )

    # 6. Typography Layout & Rendering
    text_color = parse_color(style["text_color"])
    subtitle_color = parse_color(style["subtitle_color"])
    footer_color = parse_color(style["footer_color"])

    title_str = title_block.get("text", "").strip()
    if title_block.get("uppercase"):
        title_str = title_str.upper()

    names_str = names_block.get("text", "").strip()
    if names_block.get("uppercase"):
        names_str = names_str.upper()
    resolved_n_font = resolve_font(names_block.get("font"), "GreatVibes")
    if resolved_n_font == "GreatVibes" and " & " in names_str:
        names_str = names_str.replace(" & ", "   &   ")

    date_str = date_block.get("text", "").strip()
    if date_block.get("uppercase"):
        date_str = date_str.upper()

    combined_loc = []
    if location_block.get("enabled", True) and location_block.get("text", "").strip():
        l_str = location_block.get("text", "").strip()
        if location_block.get("uppercase"):
            l_str = l_str.upper()
        combined_loc.append(l_str)
    if coords_block.get("enabled", True) and coords_block.get("text", "").strip():
        c_str = coords_block.get("text", "").strip()
        if coords_block.get("uppercase"):
            c_str = c_str.upper()
        combined_loc.append(c_str)
    loc_str = " • ".join(combined_loc) if combined_loc else ""

    # 1. Main Title
    if is_curved:
        if title_block.get("enabled", True) and title_str:
            curved_radius = (layout["radius"] + 22.0) * canonical_scale
            _draw_curved_text(
                c=c,
                text=title_str,
                cx=cx,
                cy=cy,
                radius=curved_radius,
                font_name=resolve_font(title_block.get("font"), "Cinzel"),
                font_size=layout["eff_title_size"] * canonical_scale,
                color=text_color,
                tracking=float(title_block.get("tracking", 2.5)) * canonical_scale,
            )
    else:
        if title_block.get("enabled", True) and title_str and layout["titleY"] > 0:
            pdf_title_y = page_height - (layout["titleY"] * canonical_scale)
            _draw_centered_tracked_string(
                c=c,
                cx=cx,
                y=pdf_title_y,
                text=title_str,
                font_name=resolve_font(title_block.get("font"), "Cinzel"),
                font_size=layout["eff_title_size"] * canonical_scale,
                color=text_color,
                tracking=float(title_block.get("tracking", 2.5)) * canonical_scale,
            )

    # 2. Moon phases divider (if moon_phases layout)
    if is_moon_phases and layout["moonPhasesY"] > 0:
        pdf_moon_y = page_height - (layout["moonPhasesY"] * canonical_scale)
        _draw_moon_phases_row(c, cx, pdf_moon_y, subtitle_color, scale_factor * canonical_scale)

    # 3. Names / Couple Calligraphy
    if names_block.get("enabled", True) and names_str and layout["namesY"] > 0:
        pdf_names_y = page_height - (layout["namesY"] * canonical_scale)
        if resolved_n_font == "GreatVibes":
            c.setFont(resolved_n_font, layout["eff_names_size"] * canonical_scale)
            c.setFillColor(subtitle_color)
            c.drawCentredString(cx, pdf_names_y, names_str)
        else:
            _draw_centered_tracked_string(
                c=c,
                cx=cx,
                y=pdf_names_y,
                text=names_str,
                font_name=resolved_n_font,
                font_size=layout["eff_names_size"] * canonical_scale,
                color=subtitle_color,
                tracking=float(names_block.get("tracking", 1.0)) * canonical_scale,
            )

    # 4. Decorative Divider Ornament
    if divider_style and divider_style != "none" and layout["dividerY"] > 0:
        pdf_div_y = page_height - (layout["dividerY"] * canonical_scale)
        _draw_divider(
            c=c,
            cx=cx,
            y=pdf_div_y,
            style=divider_style,
            color=subtitle_color,
            scale=canonical_scale,
            div_scale=layout["div_scale"],
        )

    # 5. Significant Date
    if date_block.get("enabled", True) and date_str and layout["dateY"] > 0:
        pdf_date_y = page_height - (layout["dateY"] * canonical_scale)
        _draw_centered_tracked_string(
            c=c,
            cx=cx,
            y=pdf_date_y,
            text=date_str,
            font_name=resolve_font(date_block.get("font"), "Montserrat"),
            font_size=layout["eff_date_size"] * canonical_scale,
            color=footer_color,
            tracking=float(date_block.get("tracking", 2.0)) * canonical_scale,
        )

    # 6. Location & Coordinates Text
    if loc_str and layout["locY"] > 0:
        pdf_loc_y = page_height - (layout["locY"] * canonical_scale)
        _draw_centered_tracked_string(
            c=c,
            cx=cx,
            y=pdf_loc_y,
            text=loc_str,
            font_name=resolve_font(coords_block.get("font"), "Montserrat"),
            font_size=layout["eff_coord_size"] * canonical_scale,
            color=footer_color,
            tracking=float(coords_block.get("tracking", 1.8)) * canonical_scale,
        )

    c.showPage()
    c.save()

    return buffer.getvalue()
