"""
Procedural celestial background textures:
- Milky Way galactic dust band & cosmic stardust
- Ethereal watercolor washes
"""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

TEXTURES_DIR = Path(__file__).resolve().parent.parent / "data" / "textures"


def get_milky_way_texture(width: int = 1600, height: int = 1600) -> str:
    """Generate or retrieve cached realistic Milky Way stardust band."""
    TEXTURES_DIR.mkdir(parents=True, exist_ok=True)
    out_file = TEXTURES_DIR / f"milky_way_{width}x{height}.png"
    if out_file.exists():
        return str(out_file)

    # Coordinates centered at (0, 0)
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)

    # Rotate coordinates by ~38 degrees to angle the galactic plane
    angle = np.radians(38)
    xr = xx * np.cos(angle) - yy * np.sin(angle)
    yr = xx * np.sin(angle) + yy * np.cos(angle)

    # Radial mask: fade to zero near disk edge
    r = np.sqrt(xx**2 + yy**2)
    radial_mask = np.clip(1.0 - (r / 0.95)**2, 0, 1)

    # Galactic plane intensity: concentrated near yr = 0
    # Add gentle wavy curve to galactic plane
    wave = np.sin(xr * 3.0) * 0.08 + np.cos(xr * 6.0) * 0.04
    dist_from_plane = np.abs(yr - wave)
    band = np.exp(-(dist_from_plane / 0.22)**2)

    # Galactic bulge near center
    bulge = 1.4 * np.exp(-(xr**2 / 0.35 + yr**2 / 0.15))
    intensity = (band * 0.7 + bulge * 0.8) * radial_mask

    # Add fine stardust clouds (turbulence)
    noise1 = np.sin(xx * 25 + yy * 20) * 0.15 + np.cos(xx * 40 - yy * 35) * 0.1
    noise2 = np.sin(xx * 60 + yy * 55) * 0.05
    stardust = np.clip(intensity + (noise1 + noise2) * intensity, 0, 1)

    # High-density star particles (micro dots)
    np.random.seed(42)
    micro_stars = (np.random.rand(height, width) > 0.992).astype(np.float32) * radial_mask * (0.3 + intensity * 0.7)

    total = np.clip(stardust * 0.45 + micro_stars * 0.55, 0, 1)

    # Subtle soft blue/silver-white hue for cosmic dust
    r_chan = (total * 215).astype(np.uint8)
    g_chan = (total * 225).astype(np.uint8)
    b_chan = (total * 255).astype(np.uint8)
    alpha = (total * 160).astype(np.uint8)

    rgba = np.stack([r_chan, g_chan, b_chan, alpha], axis=-1)
    img = Image.fromarray(rgba, mode="RGBA")
    img = img.filter(ImageFilter.GaussianBlur(radius=2.5))

    img.save(str(out_file), format="PNG", optimize=True)
    return str(out_file)
