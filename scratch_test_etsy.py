"""
Test generating an Etsy-style star map PDF and convert it to PNG using macOS sips for visual inspection.
"""
import json
import subprocess
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent / "backend"))

from datetime import datetime
from app.pdf_generator import generate_star_map_pdf

test_payload = {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "date_time": datetime(2026, 9, 22, 21, 0),
    "poster_size": "18x24",
    "style_id": "midnight_classic",
    "titleBlock": {
        "text": "THE NIGHT WE MET",
        "font": "Cinzel",
        "size": 38,
        "tracking": 3,
        "uppercase": True,
        "italic": False,
        "enabled": True,
    },
    "namesBlock": {
        "text": "Emma & Noah",
        "font": "Great Vibes",
        "size": 28,
        "tracking": 1,
        "uppercase": False,
        "italic": False,
        "enabled": True,
    },
    "taglineBlock": {
        "text": "Under this sky, our forever began",
        "font": "Playfair Display",
        "size": 13,
        "tracking": 1,
        "uppercase": False,
        "italic": True,
        "enabled": False,
    },
    "dateBlock": {
        "text": "SEPTEMBER 22, 2026",
        "font": "Montserrat",
        "size": 12.5,
        "tracking": 2.5,
        "uppercase": True,
        "italic": False,
        "enabled": True,
    },
    "locationBlock": {
        "text": "NEW YORK, NY",
        "font": "Montserrat",
        "size": 11,
        "tracking": 2,
        "uppercase": True,
        "italic": False,
        "enabled": True,
    },
    "coordsBlock": {
        "text": "40.7128° N • 74.0060° W",
        "font": "Montserrat",
        "size": 10,
        "tracking": 1.8,
        "uppercase": True,
        "italic": False,
        "enabled": True,
    },
    "show_matted_border": False,
    "show_celestial_grid": True,
    "show_constellation_lines": True,
    "show_milky_way": True,
    "divider_style": "diamond",
}

print("Generating PDF...")
pdf_bytes = generate_star_map_pdf(test_payload)
pdf_path = Path("/Users/Jure/.gemini/antigravity/brain/89bec2a6-35f1-43a0-ab92-50e5d234895a/etsy_anniversary_star_map.pdf")
pdf_path.write_bytes(pdf_bytes)
print(f"Saved PDF to {pdf_path} ({len(pdf_bytes)} bytes)")

png_path = Path("/Users/Jure/.gemini/antigravity/brain/89bec2a6-35f1-43a0-ab92-50e5d234895a/etsy_anniversary_star_map.png")
res = subprocess.run(["sips", "-s", "format", "png", str(pdf_path), "--out", str(png_path)], capture_output=True, text=True)
print("sips output:", res.stdout, res.stderr)
if png_path.exists():
    print(f"Generated PNG: {png_path} ({png_path.stat().st_size} bytes)")
else:
    print("PNG conversion failed")
