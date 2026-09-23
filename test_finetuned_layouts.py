"""
Generate PDFs and PNGs for the fine-tuned layouts:
1. Top Title (optimized spacing above circle, improved lower text breathing room)
2. Curved Border (perfect vertical centering)
3. Moon Phases (moons & date/coords unchanged, title+names at 1/3 distance between moons and divider)
"""
from datetime import datetime
from pathlib import Path
import subprocess
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent / "backend"))
from app.astronomy import init_astronomy
from app.pdf_generator import generate_star_map_pdf, register_fonts

ARTIFACT_DIR = Path("/Users/Jure/.gemini/antigravity/brain/89bec2a6-35f1-43a0-ab92-50e5d234895a")

def run():
    init_astronomy()
    register_fonts()

    base_config = {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "date_time": datetime(2026, 9, 22, 21, 0),
        "poster_size": "50x70",
        "mask_shape": "circle",
        "style_id": "midnight_classic",
        "titleBlock": {
            "text": "THE NIGHT OUR STARS ALIGNED",
            "font": "Cinzel",
            "size": 38,
            "tracking": 3,
            "uppercase": True,
            "enabled": True,
        },
        "namesBlock": {
            "text": "Alexander & Victoria",
            "font": "Great Vibes",
            "size": 51,
            "tracking": 1,
            "uppercase": False,
            "enabled": True,
        },
        "dateBlock": {
            "text": "SEPTEMBER 22, 2026",
            "font": "Montserrat",
            "size": 27,
            "tracking": 2.2,
            "uppercase": True,
            "enabled": True,
        },
        "locationBlock": {
            "text": "NEW YORK, NY",
            "font": "Montserrat",
            "size": 21,
            "tracking": 2,
            "uppercase": True,
            "enabled": True,
        },
        "coordsBlock": {
            "text": "40°42'46.1\"N • 74°00'21.6\"W",
            "font": "Montserrat",
            "size": 21,
            "tracking": 1.8,
            "uppercase": True,
            "enabled": True,
        },
        "divider_style": "diamond",
        "divider_size": 34.0,
        "show_celestial_grid": True,
        "show_constellation_lines": True,
        "show_milky_way": True,
    }

    tests = [
        ("top_title", "finetuned_top_title", {
            "layout_variation": "top_title",
            "titleBlock": {
                "text": "THE NIGHT WE MET",
                "font": "Cinzel",
                "size": 38,
                "tracking": 3,
                "uppercase": True,
                "enabled": True,
            },
        }),
        ("curved_border", "finetuned_curved_border", {
            "layout_variation": "curved_border",
            "style_id": "border_text",
            "titleBlock": {
                "text": "UNDER THIS SKY",
                "font": "Cinzel",
                "size": 38,
                "tracking": 2.5,
                "uppercase": True,
                "enabled": True,
            },
        }),
        ("moon_phases", "finetuned_moon_phases", {
            "layout_variation": "moon_phases",
            "poster_size": "30x40",
            "titleBlock": {
                "text": "WHERE IT HAPPENED",
                "font": "Cinzel",
                "size": 38,
                "tracking": 3,
                "uppercase": True,
                "enabled": True,
            },
        }),
    ]

    for layout_key, file_stem, overrides in tests:
        cfg = dict(base_config)
        cfg.update(overrides)
        print(f"Generating {file_stem}.pdf ...")
        pdf_bytes = generate_star_map_pdf(cfg)
        pdf_path = ARTIFACT_DIR / f"{file_stem}.pdf"
        pdf_path.write_bytes(pdf_bytes)

        png_path = ARTIFACT_DIR / f"{file_stem}.png"
        subprocess.run(["sips", "-s", "format", "png", str(pdf_path), "--out", str(png_path)], capture_output=True)
        print(f"Rendered {png_path} ({png_path.stat().st_size if png_path.exists() else 0} bytes)")

    print("All fine-tuned tests generated successfully!")

if __name__ == "__main__":
    run()
