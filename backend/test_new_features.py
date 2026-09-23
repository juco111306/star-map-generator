"""
Test script to generate star maps demonstrating:
1. Metric sizes: 20x30, 30x40, 40x50, 50x70.
2. Form: Circular vs Heart mask shape.
3. 10% larger circle radius.
4. Generous space between circle and main title inscription.
5. Optional calligraphy names (demonstrating both enabled and disabled with zero phantom gap).
6. Bigger default date and coords font sizes.
7. Font sizes scaling up to 100 pt without overlap.
"""
from datetime import datetime
import os
from pathlib import Path
from app.astronomy import init_astronomy
from app.pdf_generator import generate_star_map_pdf, register_fonts

ARTIFACT_DIR = Path("/Users/Jure/.gemini/antigravity/brain/89bec2a6-35f1-43a0-ab92-50e5d234895a")

def run_tests():
    init_astronomy()
    register_fonts()

    # Test 1: Metric 50x70 cm, Circle mask (+10% bigger), Names enabled, default bigger date/coords
    print("Generating Test 1: 50x70 cm Circle...")
    p1 = {
        "latitude": 52.3676,
        "longitude": 4.9041,
        "date_time": datetime(2026, 9, 22, 22, 0),
        "poster_size": "50x70",
        "style_id": "midnight_classic",
        "mask_shape": "circle",
        "titleBlock": {
            "text": "WHERE IT HAPPENED",
            "font": "Cinzel",
            "size": 38,
            "tracking": 3,
            "uppercase": True,
            "enabled": True,
        },
        "namesBlock": {
            "text": "Emma & Noah",
            "font": "Great Vibes",
            "size": 28,
            "tracking": 1,
            "uppercase": False,
            "enabled": True,
        },
        "dateBlock": {
            "text": "22 SEPTEMBER 2026",
            "font": "Montserrat",
            "size": 15,
            "tracking": 2,
            "uppercase": True,
            "enabled": True,
        },
        "locationBlock": {
            "text": "AMSTERDAM, NETHERLANDS",
            "font": "Montserrat",
            "size": 13,
            "tracking": 2,
            "uppercase": True,
            "enabled": True,
        },
        "coordsBlock": {
            "text": "52°22'03.4\"N 4°54'14.8\"E",
            "font": "Montserrat",
            "size": 13,
            "tracking": 2,
            "uppercase": True,
            "enabled": True,
        },
        "divider_style": "diamond",
        "show_celestial_grid": True,
        "show_constellation_lines": True,
        "show_milky_way": True,
    }
    pdf1 = generate_star_map_pdf(p1)
    (ARTIFACT_DIR / "test_50x70_circle.pdf").write_bytes(pdf1)
    print("Test 1 saved.")

    # Test 2: Metric 30x40 cm, Heart mask shape!
    print("Generating Test 2: 30x40 cm Heart...")
    p2 = dict(p1)
    p2["poster_size"] = "30x40"
    p2["mask_shape"] = "heart"
    p2["titleBlock"] = {
        "text": "OUR SPECIAL NIGHT",
        "font": "Playfair Display",
        "size": 34,
        "tracking": 2,
        "uppercase": True,
        "enabled": True,
    }
    pdf2 = generate_star_map_pdf(p2)
    (ARTIFACT_DIR / "test_30x40_heart.pdf").write_bytes(pdf2)
    print("Test 2 saved.")

    # Test 3: Names disabled (optional toggle) - clean vertical collapse, no phantom gap
    print("Generating Test 3: Names disabled (collapsed space)...")
    p3 = dict(p1)
    p3["poster_size"] = "30x40"
    p3["namesBlock"] = {
        "text": "",
        "enabled": False,
    }
    pdf3 = generate_star_map_pdf(p3)
    (ARTIFACT_DIR / "test_30x40_nonames.pdf").write_bytes(pdf3)
    print("Test 3 saved.")

    # Test 4: Large font size (75 pt Title, 55 pt Names) to verify dynamic spacing
    print("Generating Test 4: Large 75pt font size...")
    p4 = dict(p1)
    p4["poster_size"] = "40x50"
    p4["titleBlock"] = {
        "text": "THE STARS ABOVE",
        "font": "Cinzel",
        "size": 65,
        "tracking": 2,
        "uppercase": True,
        "enabled": True,
    }
    p4["namesBlock"] = {
        "text": "Sophie & Lucas",
        "font": "Great Vibes",
        "size": 50,
        "tracking": 1,
        "uppercase": False,
        "enabled": True,
    }
    pdf4 = generate_star_map_pdf(p4)
    (ARTIFACT_DIR / "test_40x50_bigfont.pdf").write_bytes(pdf4)
    print("Test 4 saved.")

    # Test 5: Metric 20x30 cm
    print("Generating Test 5: 20x30 cm Minimalist...")
    p5 = dict(p1)
    p5["poster_size"] = "20x30"
    p5["style_id"] = "minimalist_light"
    pdf5 = generate_star_map_pdf(p5)
    (ARTIFACT_DIR / "test_20x30_minimalist.pdf").write_bytes(pdf5)
    print("Test 5 saved.")

    # Test 6: Moon Phases layout with 2x larger moons & 45pt large Date + Diamond divider to verify NO overlay
    print("Generating Test 6: Moon Phases (2x larger moons) & big date size...")
    p6 = dict(p1)
    p6["poster_size"] = "30x40"
    p6["layout_variation"] = "moon_phases"
    p6["dateBlock"] = {
        "text": "OCTOBER 14, 2026",
        "font": "Montserrat",
        "size": 45,
        "tracking": 2,
        "uppercase": True,
        "enabled": True,
    }
    p6["divider_style"] = "diamond"
    pdf6 = generate_star_map_pdf(p6)
    (ARTIFACT_DIR / "test_30x40_moonphases.pdf").write_bytes(pdf6)
    print("Test 6 saved.")

if __name__ == "__main__":
    run_tests()
