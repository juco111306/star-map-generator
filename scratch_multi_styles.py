"""
Generate multiple Etsy style samples and convert to PNG for visual inspection.
"""
from datetime import datetime
from pathlib import Path
import subprocess
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent / "backend"))
from app.pdf_generator import generate_star_map_pdf

styles_to_test = [
    ("teal_watercolor", "watercolor_sample"),
    ("the_heart_navy", "heart_sample"),
    ("minimalist_light", "minimalist_sample"),
]

for style_id, output_name in styles_to_test:
    payload = {
        "latitude": 51.5074,
        "longitude": -0.1278,
        "date_time": datetime(2026, 6, 15, 22, 30),
        "poster_size": "18x24",
        "style_id": style_id,
        "titleBlock": {
            "text": "UNDER THIS SKY",
            "font": "Cinzel",
            "size": 38,
            "tracking": 3,
            "uppercase": True,
            "italic": False,
            "enabled": True,
        },
        "namesBlock": {
            "text": "Oliver & Charlotte",
            "font": "Great Vibes",
            "size": 30,
            "tracking": 1,
            "uppercase": False,
            "italic": False,
            "enabled": True,
        },
        "taglineBlock": {
            "text": "I have found the one whom my soul loves",
            "font": "Playfair Display",
            "size": 13,
            "tracking": 1,
            "uppercase": False,
            "italic": True,
            "enabled": True,
        },
        "dateBlock": {
            "text": "JUNE 15, 2026",
            "font": "Montserrat",
            "size": 12.5,
            "tracking": 2.2,
            "uppercase": True,
            "italic": False,
            "enabled": True,
        },
        "locationBlock": {
            "text": "LONDON, UK",
            "font": "Montserrat",
            "size": 11,
            "tracking": 2,
            "uppercase": True,
            "italic": False,
            "enabled": True,
        },
        "coordsBlock": {
            "text": "51.5074° N • 0.1278° W",
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
        "divider_style": "heart" if "heart" in style_id else "star",
    }

    pdf_bytes = generate_star_map_pdf(payload)
    pdf_path = Path(f"/Users/Jure/.gemini/antigravity/brain/89bec2a6-35f1-43a0-ab92-50e5d234895a/{output_name}.pdf")
    pdf_path.write_bytes(pdf_bytes)

    png_path = Path(f"/Users/Jure/.gemini/antigravity/brain/89bec2a6-35f1-43a0-ab92-50e5d234895a/{output_name}.png")
    subprocess.run(["sips", "-s", "format", "png", str(pdf_path), "--out", str(png_path)], capture_output=True)
    print(f"Generated {png_path} ({png_path.stat().st_size if png_path.exists() else 0} bytes)")
