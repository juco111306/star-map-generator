"""
Robust multi-tier geocoding service with:
1. Open-Meteo Geocoding (fast, global, comprehensive)
2. OpenStreetMap Nominatim fallback
3. Direct coordinate parsing (e.g. "46.05, 14.50")
4. Built-in offline fallback database for major world cities
"""
import re
from typing import Any, Dict, List, Optional
import urllib.parse
import httpx

# In-memory cache
_cache: Dict[str, List[Dict[str, Any]]] = {}

# Built-in offline fallback database
OFFLINE_CITIES = [
    {"name": "New York, USA", "lat": 40.7128, "lon": -74.0060},
    {"name": "Los Angeles, USA", "lat": 34.0522, "lon": -118.2437},
    {"name": "Chicago, USA", "lat": 41.8781, "lon": -87.6298},
    {"name": "Houston, USA", "lat": 29.7604, "lon": -95.3698},
    {"name": "Miami, USA", "lat": 25.7617, "lon": -80.1918},
    {"name": "San Francisco, USA", "lat": 37.7749, "lon": -122.4194},
    {"name": "Seattle, USA", "lat": 47.6062, "lon": -122.3321},
    {"name": "Toronto, Canada", "lat": 43.6532, "lon": -79.3832},
    {"name": "Vancouver, Canada", "lat": 49.2827, "lon": -123.1207},
    {"name": "London, United Kingdom", "lat": 51.5074, "lon": -0.1278},
    {"name": "Paris, France", "lat": 48.8566, "lon": 2.3522},
    {"name": "Berlin, Germany", "lat": 52.5200, "lon": 13.4050},
    {"name": "Rome, Italy", "lat": 41.9028, "lon": 12.4964},
    {"name": "Madrid, Spain", "lat": 40.4168, "lon": -3.7038},
    {"name": "Barcelona, Spain", "lat": 41.3879, "lon": 2.1699},
    {"name": "Amsterdam, Netherlands", "lat": 52.3676, "lon": 4.9041},
    {"name": "Vienna, Austria", "lat": 48.2082, "lon": 16.3738},
    {"name": "Zurich, Switzerland", "lat": 47.3769, "lon": 8.5417},
    {"name": "Ljubljana, Slovenia", "lat": 46.0569, "lon": 14.5058},
    {"name": "Maribor, Slovenia", "lat": 46.5547, "lon": 15.6459},
    {"name": "Zagreb, Croatia", "lat": 45.8150, "lon": 15.9819},
    {"name": "Belgrade, Serbia", "lat": 44.7866, "lon": 20.4489},
    {"name": "Prague, Czech Republic", "lat": 50.0755, "lon": 14.4378},
    {"name": "Budapest, Hungary", "lat": 47.4979, "lon": 19.0402},
    {"name": "Warsaw, Poland", "lat": 52.2297, "lon": 21.0122},
    {"name": "Stockholm, Sweden", "lat": 59.3293, "lon": 18.0686},
    {"name": "Oslo, Norway", "lat": 59.9139, "lon": 10.7522},
    {"name": "Copenhagen, Denmark", "lat": 55.6761, "lon": 12.5683},
    {"name": "Helsinki, Finland", "lat": 60.1699, "lon": 24.9384},
    {"name": "Athens, Greece", "lat": 37.9838, "lon": 23.7275},
    {"name": "Istanbul, Turkey", "lat": 41.0082, "lon": 28.9784},
    {"name": "Dubai, UAE", "lat": 25.2048, "lon": 55.2708},
    {"name": "Tokyo, Japan", "lat": 35.6762, "lon": 139.6503},
    {"name": "Kyoto, Japan", "lat": 35.0116, "lon": 135.7681},
    {"name": "Seoul, South Korea", "lat": 37.5665, "lon": 126.9780},
    {"name": "Beijing, China", "lat": 39.9042, "lon": 116.4074},
    {"name": "Shanghai, China", "lat": 31.2304, "lon": 121.4737},
    {"name": "Hong Kong", "lat": 22.3193, "lon": 114.1694},
    {"name": "Singapore", "lat": 1.3521, "lon": 103.8198},
    {"name": "Bangkok, Thailand", "lat": 13.7563, "lon": 100.5018},
    {"name": "Sydney, Australia", "lat": -33.8688, "lon": 151.2093},
    {"name": "Melbourne, Australia", "lat": -37.8136, "lon": 144.9631},
    {"name": "Auckland, New Zealand", "lat": -36.8485, "lon": 174.7633},
    {"name": "Buenos Aires, Argentina", "lat": -34.6037, "lon": -58.3816},
    {"name": "Rio de Janeiro, Brazil", "lat": -22.9068, "lon": -43.1729},
    {"name": "São Paulo, Brazil", "lat": -23.5505, "lon": -46.6333},
    {"name": "Santiago, Chile", "lat": -33.4489, "lon": -70.6693},
    {"name": "Cape Town, South Africa", "lat": -33.9249, "lon": 18.4241},
    {"name": "Cairo, Egypt", "lat": 30.0444, "lon": 31.2357},
    {"name": "Reykjavik, Iceland", "lat": 64.1466, "lon": -21.9426},
]


def _try_parse_coordinates(q: str) -> Optional[List[Dict[str, Any]]]:
    """Check if query is direct latitude/longitude numbers."""
    coord_pattern = r"^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$"
    m = re.match(coord_pattern, q.strip())
    if m:
        lat = float(m.group(1))
        lon = float(m.group(2))
        if -90 <= lat <= 90 and -180 <= lon <= 180:
            return [{
                "display_name": f"Custom Coordinates ({lat:.4f}, {lon:.4f})",
                "name": f"{lat:.4f}, {lon:.4f}",
                "lat": lat,
                "lon": lon,
            }]
    return None


async def search_location(query: str) -> List[Dict[str, Any]]:
    """Search for locations using multi-tier providers."""
    q = query.strip()
    if not q or len(q) < 2:
        return []

    cache_key = q.lower()
    if cache_key in _cache:
        return _cache[cache_key]

    # 1. Direct coordinate check
    coords = _try_parse_coordinates(q)
    if coords:
        _cache[cache_key] = coords
        return coords

    results: List[Dict[str, Any]] = []

    # 2. Open-Meteo Geocoding API (Fast, reliable, global)
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={urllib.parse.quote(q)}&count=8&language=en&format=json"
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json().get("results", [])
                for item in data:
                    country = item.get("country", "")
                    admin1 = item.get("admin1", "")
                    city_name = item.get("name", "")
                    
                    parts = [city_name]
                    if admin1 and admin1 != city_name:
                        parts.append(admin1)
                    if country:
                        parts.append(country)
                    
                    display = ", ".join(parts)
                    results.append({
                        "display_name": display,
                        "name": f"{city_name}, {country}" if country else city_name,
                        "lat": float(item["latitude"]),
                        "lon": float(item["longitude"]),
                    })
    except Exception as e:
        print(f"Open-Meteo geocoding warning: {e}")

    # 3. OpenStreetMap Nominatim fallback if Open-Meteo yielded nothing
    if not results:
        try:
            nom_url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(q)}&format=json&limit=5&addressdetails=1"
            headers = {"User-Agent": "CustomStarMap/1.0 (info@starmap.local)"}
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(nom_url, headers=headers)
                if resp.status_code == 200:
                    nom_data = resp.json()
                    for item in nom_data:
                        results.append({
                            "display_name": item.get("display_name"),
                            "name": item.get("name") or item.get("display_name").split(",")[0],
                            "lat": float(item["lat"]),
                            "lon": float(item["lon"]),
                        })
        except Exception as e:
            print(f"Nominatim warning: {e}")

    # 4. Offline database fallback match
    if not results:
        q_lower = q.lower()
        matched = []
        for city in OFFLINE_CITIES:
            if q_lower in city["name"].lower():
                matched.append({
                    "display_name": city["name"],
                    "name": city["name"],
                    "lat": city["lat"],
                    "lon": city["lon"],
                })
        results.extend(matched[:5])

    _cache[cache_key] = results
    return results
