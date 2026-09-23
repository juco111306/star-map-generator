"""
Celestial calculations engine powered by Skyfield, Hipparcos star catalog,
and Stellarium constellation data.
"""
from datetime import datetime, timezone
import os
from pathlib import Path
from typing import Dict, List, Tuple, Any

import numpy as np
import pandas as pd
from skyfield.api import Star, load, wgs84
from skyfield.data import stellarium

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
EPHEMERIS_PATH = DATA_DIR / "de421.bsp"
HIPPARCOS_PATH = DATA_DIR / "hipparcos_filtered.parquet"
CONSTELLATIONS_PATH = DATA_DIR / "constellations.json"

# In-memory singletons for performance
_eph = None
_earth = None
_ts = None
_stars_df = None
_skyfield_stars = None
_constellations = None
_constellation_edges = None
_constellation_star_ids = set()


def init_astronomy():
    """Preload astronomical data into memory."""
    global _eph, _earth, _ts, _stars_df, _skyfield_stars, _constellations, _constellation_edges, _constellation_star_ids
    if _eph is not None:
        return

    _eph = load(str(EPHEMERIS_PATH))
    _earth = _eph["earth"]
    _ts = load.timescale(builtin=True)

    _stars_df = pd.read_parquet(str(HIPPARCOS_PATH))
    _skyfield_stars = Star.from_dataframe(_stars_df)

    with open(str(CONSTELLATIONS_PATH), "r") as f:
        _constellations = stellarium.parse_constellations_json(f)

    _constellation_edges = []
    _constellation_star_ids = set()
    for name, edges in _constellations:
        for h1, h2 in edges:
            _constellation_edges.append((name, h1, h2))
            _constellation_star_ids.add(h1)
            _constellation_star_ids.add(h2)


def calculate_celestial_sphere(
    latitude: float,
    longitude: float,
    dt: datetime,
    max_magnitude: float = 6.0,
) -> Dict[str, Any]:
    """
    Calculate star and constellation positions projected on a 2D zenithal celestial sphere.
    
    Coordinates are normalized:
      - Center (0, 0) = Zenith (directly overhead, alt = 90 deg)
      - Horizon circle boundary (radius = 1.0) = Horizon (alt = 0 deg)
      - Orientation: Looking up at the sky:
          North is +y (top, az = 0 deg)
          South is -y (bottom, az = 180 deg)
          East is -x (left, az = 90 deg)
          West is +x (right, az = 270 deg)
    """
    init_astronomy()

    # Ensure UTC datetime
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)

    t = _ts.from_datetime(dt)
    observer = _earth + wgs84.latlon(latitude, longitude)

    # Compute apparent positions for all stars
    astrometric = observer.at(t).observe(_skyfield_stars)
    apparent = astrometric.apparent()
    alt, az, _ = apparent.altaz()

    alt_deg = alt.degrees
    az_rad = az.radians
    magnitudes = _stars_df["magnitude"].values
    hip_ids = _stars_df.index.values

    # Normalized radius: alt 90 -> r=0; alt 0 -> r=1
    r = (90.0 - alt_deg) / 90.0
    x = -r * np.sin(az_rad)
    y = r * np.cos(az_rad)

    # Store mapping of hip_id to projected coordinates
    star_lookup = {}
    for hid, sx, sy, salt, smag in zip(hip_ids, x, y, alt_deg, magnitudes):
        star_lookup[hid] = (sx, sy, salt, smag)

    # Filter visible stars
    # We include stars with alt > 0 and magnitude <= max_magnitude
    visible_stars = []
    constellation_star_points = []

    for hid, (sx, sy, salt, smag) in star_lookup.items():
        if salt <= 0:
            continue
        is_constellation_vertex = hid in _constellation_star_ids

        # Size scaling based on magnitude (brighter stars have smaller magnitude, so larger size)
        # Sirius is ~ -1.44, faint stars are ~ 6.0
        # Radius scale factor between 0.35 and 2.5
        size = float(np.clip(2.6 - 0.36 * smag, 0.4, 3.2))

        star_obj = {
            "x": round(float(sx), 5),
            "y": round(float(sy), 5),
            "mag": round(float(smag), 2),
            "size": round(size, 2),
            "is_constellation": is_constellation_vertex,
        }

        if smag <= max_magnitude or is_constellation_vertex:
            visible_stars.append(star_obj)

        if is_constellation_vertex:
            constellation_star_points.append(star_obj)

    # Calculate visible constellation lines
    visible_lines = []
    for cname, h1, h2 in _constellation_edges:
        p1 = star_lookup.get(h1)
        p2 = star_lookup.get(h2)
        if p1 is None or p2 is None:
            continue
        # Both stars must be above the horizon
        if p1[2] > 0 and p2[2] > 0:
            visible_lines.append(
                {
                    "constellation": cname,
                    "p1": [round(float(p1[0]), 5), round(float(p1[1]), 5)],
                    "p2": [round(float(p2[0]), 5), round(float(p2[1]), 5)],
                }
            )

    return {
        "stars": visible_stars,
        "lines": visible_lines,
        "constellation_stars": constellation_star_points,
        "total_visible_stars": len(visible_stars),
        "total_visible_lines": len(visible_lines),
    }
