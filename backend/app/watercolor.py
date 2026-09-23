"""
Watercolor texture and gradient utilities for Styles 4 and 8.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

TEXTURES_DIR = Path(__file__).resolve().parent.parent / "data" / "textures"


def get_teal_watercolor_image(width: int = 1600, height: int = 1600) -> str:
    """Generate or retrieve cached high-resolution teal watercolor texture."""
    TEXTURES_DIR.mkdir(parents=True, exist_ok=True)
    out_file = TEXTURES_DIR / f"teal_watercolor_{width}x{height}.png"
    if out_file.exists():
        return str(out_file)

    # Create procedural organic watercolor gradient
    # Center deep teal #0D4A52, mid #136F78, rim #082E34
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)
    r = np.sqrt(xx**2 + yy**2)

    # Add organic pseudo-perlin turbulence using multiple sine waves
    noise = (
        np.sin(xx * 5 + yy * 4) * 0.08
        + np.cos(xx * 9 - yy * 7) * 0.05
        + np.sin(xx * 15 + yy * 13) * 0.03
    )
    dist = np.clip(r + noise, 0, 1.2) / 1.2

    # Interpolate colors:
    # 0.0: [15, 78, 92] (deep rich teal)
    # 0.5: [19, 105, 114] (vibrant teal)
    # 0.85: [10, 48, 56] (dark outer)
    # 1.0+: [6, 28, 33] (rim)
    r_chan = np.clip(15 * (1 - dist) + 19 * np.sin(dist * np.pi) + 6 * dist, 6, 30)
    g_chan = np.clip(78 * (1 - dist) + 114 * np.sin(dist * np.pi) + 28 * dist, 28, 120)
    b_chan = np.clip(92 * (1 - dist) + 126 * np.sin(dist * np.pi) + 36 * dist, 36, 135)

    rgb = np.stack([r_chan, g_chan, b_chan], axis=-1).astype(np.uint8)
    img = Image.fromarray(rgb)
    img = img.filter(ImageFilter.GaussianBlur(radius=8))

    img.save(str(out_file), format="PNG", optimize=True)
    return str(out_file)
