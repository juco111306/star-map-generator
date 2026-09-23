"""
Test script to verify the new standard settings:
1. Standard text sizes:
   - names: 51 pt
   - date: 27 pt
   - location & coords: 21 pt
   - decorative divider: 34 pt
2. New title suggestions:
   - "THE NIGHT OUR STARS ALIGNED"
   - "THE NIGHT WE SAID 'I DO'"
   - "THE STAR WAS BORN"
   - "THE BEGINNING OF OUR ADVENTURE"
3. Layout variations across curated styles.
"""
from datetime import datetime
from pathlib import Path
from app.astronomy import init_astronomy
from app.pdf_generator import generate_star_map_pdf, register_fonts

ARTIFACT_DIR = Path("/Users/Jure/.gemini/antigravity/brain/89bec2a6-35f1-43a0-ab92-50e5d234895a")

def run_tests():
    init_astronomy()
    register_fonts()

    # Standard configuration matching the new defaults
    standard_config = {
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
            "text": "Emma & Noah",
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
            "tracking": 2.5,
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
            "text": "40.7128° N • 74.0060° W",
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

    # Test 1: Standard Midnight Classic with new defaults
    print("Generating Test 1: Midnight Classic (Names 51pt, Date 27pt, Coords 21pt, Divider 34pt)...")
    pdf1 = generate_star_map_pdf(standard_config)
    (ARTIFACT_DIR / "test_standard_defaults_midnight.pdf").write_bytes(pdf1)
    print("Saved test_standard_defaults_midnight.pdf")

    # Test 2: Emerald Night with "THE NIGHT WE SAID 'I DO'"
    print("Generating Test 2: Emerald Night with 'THE NIGHT WE SAID I DO'...")
    c2 = dict(standard_config)
    c2["style_id"] = "emerald_night"
    c2["divider_style"] = "star"
    c2["titleBlock"] = {
        "text": "THE NIGHT WE SAID 'I DO'",
        "font": "Cinzel",
        "size": 38,
        "tracking": 3,
        "uppercase": True,
        "enabled": True,
    }
    c2["namesBlock"] = {
        "text": "Alexander & Victoria",
        "font": "Great Vibes",
        "size": 51,
        "tracking": 1,
        "uppercase": False,
        "enabled": True,
    }
    pdf2 = generate_star_map_pdf(c2)
    (ARTIFACT_DIR / "test_suggestion_emerald_ido.pdf").write_bytes(pdf2)
    print("Saved test_suggestion_emerald_ido.pdf")

    # Test 3: Teal Watercolor with "THE STAR WAS BORN"
    print("Generating Test 3: Teal Watercolor with 'THE STAR WAS BORN'...")
    c3 = dict(standard_config)
    c3["style_id"] = "teal_watercolor"
    c3["divider_style"] = "dot"
    c3["titleBlock"] = {
        "text": "THE STAR WAS BORN",
        "font": "Cinzel",
        "size": 38,
        "tracking": 3,
        "uppercase": True,
        "enabled": True,
    }
    c3["namesBlock"] = {
        "text": "Aurora Grace",
        "font": "Great Vibes",
        "size": 51,
        "tracking": 1,
        "uppercase": False,
        "enabled": True,
    }
    pdf3 = generate_star_map_pdf(c3)
    (ARTIFACT_DIR / "test_suggestion_teal_star_born.pdf").write_bytes(pdf3)
    print("Saved test_suggestion_teal_star_born.pdf")

    # Test 4: Burgundy Sky with "THE BEGINNING OF OUR ADVENTURE"
    print("Generating Test 4: Burgundy Sky with 'THE BEGINNING OF OUR ADVENTURE'...")
    c4 = dict(standard_config)
    c4["style_id"] = "burgundy_sky"
    c4["divider_style"] = "heart"
    c4["titleBlock"] = {
        "text": "THE BEGINNING OF OUR ADVENTURE",
        "font": "Cinzel",
        "size": 34,
        "tracking": 2.5,
        "uppercase": True,
        "enabled": True,
    }
    pdf4 = generate_star_map_pdf(c4)
    (ARTIFACT_DIR / "test_suggestion_burgundy_adventure.pdf").write_bytes(pdf4)
    print("Saved test_suggestion_burgundy_adventure.pdf")

    print("All tests completed successfully!")

if __name__ == "__main__":
    run_tests()
