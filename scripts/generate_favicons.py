#!/usr/bin/env python3
"""
Generate high-fidelity, artisan celestial icons and favicons for Stellaire Atelier.
Outputs:
- favicon.ico (multi-res 16, 32, 48)
- apple-touch-icon.png (180x180)
- icon-192.png & icon-512.png
"""

import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "frontend" / "public"
APP_DIR = Path(__file__).resolve().parent.parent / "frontend" / "src" / "app"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
APP_DIR.mkdir(parents=True, exist_ok=True)


def draw_celestial_badge(size: int) -> Image.Image:
    # Render at 4x supersampling for ultra-crisp edges, then downsample with LANCZOS
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background Squircle (Midnight Obsidian)
    margin = int(canvas_size * 0.04)
    radius = int(canvas_size * 0.24)
    bg_box = [margin, margin, canvas_size - margin, canvas_size - margin]
    
    # Gradient simulation or solid deep midnight
    draw.rounded_rectangle(bg_box, radius=radius, fill=(11, 19, 43, 255), outline=(212, 175, 55, 160), width=int(scale * 1.5))

    center = canvas_size / 2.0
    r_compass = canvas_size * 0.35

    # 2. Celestial Compass Ring
    draw.ellipse(
        [center - r_compass, center - r_compass, center + r_compass, center + r_compass],
        outline=(212, 175, 55, 90),
        width=int(scale * 1.2),
    )

    # 3. Soft Celestial Glow behind star
    glow_r = int(canvas_size * 0.22)
    glow_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    glow_draw.ellipse(
        [center - glow_r, center - glow_r, center + glow_r, center + glow_r],
        fill=(212, 175, 55, 60),
    )
    glow_img = glow_img.filter(ImageFilter.GaussianBlur(radius=int(scale * 6)))
    img = Image.alpha_composite(img, glow_img)
    draw = ImageDraw.Draw(img)

    # 4. 8-Pointed Starburst (Polaris Star)
    # Primary cardinal points (North, South, East, West)
    spike_long = canvas_size * 0.38
    spike_waist = canvas_size * 0.05
    
    # 4 main cardinal points
    for angle in [0, 90, 180, 270]:
        rad = math.radians(angle)
        rad_left = math.radians(angle - 90)
        rad_right = math.radians(angle + 90)

        tip_x = center + spike_long * math.sin(rad)
        tip_y = center - spike_long * math.cos(rad)

        waist_l_x = center + spike_waist * math.sin(rad_left)
        waist_l_y = center - spike_waist * math.cos(rad_left)

        waist_r_x = center + spike_waist * math.sin(rad_right)
        waist_r_y = center - spike_waist * math.cos(rad_right)

        draw.polygon(
            [(center, center), (waist_l_x, waist_l_y), (tip_x, tip_y), (waist_r_x, waist_r_y)],
            fill=(245, 230, 190, 255),
        )

    # 4 diagonal points (NE, SE, SW, NW) - slightly shorter
    spike_diag = canvas_size * 0.24
    waist_diag = canvas_size * 0.035
    for angle in [45, 135, 225, 315]:
        rad = math.radians(angle)
        rad_left = math.radians(angle - 90)
        rad_right = math.radians(angle + 90)

        tip_x = center + spike_diag * math.sin(rad)
        tip_y = center - spike_diag * math.cos(rad)

        waist_l_x = center + waist_diag * math.sin(rad_left)
        waist_l_y = center - waist_diag * math.cos(rad_left)

        waist_r_x = center + waist_diag * math.sin(rad_right)
        waist_r_y = center - waist_diag * math.cos(rad_right)

        draw.polygon(
            [(center, center), (waist_l_x, waist_l_y), (tip_x, tip_y), (waist_r_x, waist_r_y)],
            fill=(212, 175, 55, 220),
        )

    # 5. Brilliant Star Core
    core_r = canvas_size * 0.05
    draw.ellipse(
        [center - core_r, center - core_r, center + core_r, center + core_r],
        fill=(255, 255, 255, 255),
    )

    # 6. Four Constellation Accent Dots
    dot_dist = canvas_size * 0.28
    dot_r = max(1.5 * scale, canvas_size * 0.018)
    for angle in [45, 135, 225, 315]:
        rad = math.radians(angle)
        dx = center + dot_dist * math.sin(rad)
        dy = center - dot_dist * math.cos(rad)
        draw.ellipse([dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r], fill=(245, 230, 190, 200))

    # Downsample to target size
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img


def main():
    print("Generating Stellaire Atelier celestial favicons and icons...")

    # 1. Apple Touch Icon (180x180)
    img_180 = draw_celestial_badge(180)
    apple_icon_path = OUTPUT_DIR / "apple-touch-icon.png"
    img_180.save(apple_icon_path, format="PNG")
    # Also save to app/ for Next.js convention
    img_180.save(APP_DIR / "apple-icon.png", format="PNG")
    print(f"  ✔ Created {apple_icon_path}")

    # 2. Icon 192 and 512
    img_192 = draw_celestial_badge(192)
    img_192.save(OUTPUT_DIR / "icon-192.png", format="PNG")
    print(f"  ✔ Created {OUTPUT_DIR / 'icon-192.png'}")

    img_512 = draw_celestial_badge(512)
    img_512.save(OUTPUT_DIR / "icon-512.png", format="PNG")
    print(f"  ✔ Created {OUTPUT_DIR / 'icon-512.png'}")

    # 3. Multi-resolution Favicon ICO (16, 32, 48)
    img_16 = draw_celestial_badge(16)
    img_32 = draw_celestial_badge(32)
    img_48 = draw_celestial_badge(48)
    
    ico_path = OUTPUT_DIR / "favicon.ico"
    img_48.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    # Also place favicon.ico in src/app for Next.js App Router default route
    img_48.save(APP_DIR / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  ✔ Created {ico_path} & {APP_DIR / 'favicon.ico'}")

    print("All favicons generated successfully!")


if __name__ == "__main__":
    main()
