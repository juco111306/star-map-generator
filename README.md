# StarCraft Studio: Custom Star Map Generator Web App

A full-stack, print-ready custom star map generator application. Users can customize astronomical star charts for any location on Earth, at any date and time, choose from 10 distinct designer styles, preview their poster in real-time, and download a crisp, ultra-high-resolution 300 DPI vector PDF formatted for standard physical printing (18×24" or 24×36").

---

## 🌟 Key Features

1. **Accurate Astronomy Engine (`skyfield`)**:
   - Computes topocentric celestial coordinates using NASA JPL planetary ephemeris (`de421.bsp`).
   - Uses the Hipparcos star catalog (`hip_main.dat`, magnitude $\le 6.5$, over 8,800 visible stars).
   - Draws IAU constellation stick-figure lines using Stellarium's modern astronomical data.
   - Calculates altitude and azimuth from observer latitude, longitude, and UTC time, projecting onto a 2D zenithal stereographic celestial sphere.

2. **Split-Screen Interactive Editor**:
   - **Left Panel (Configuration)**:
     - **Print Dimensions Selector**: 18×24 inches ($5400 \times 7200$ px at 300 DPI) or 24×36 inches ($7200 \times 10800$ px at 300 DPI).
     - **10 Design Templates**: Visual thumbnail selector with live swatches and shape indicators.
     - **Location & Geocoding**: Search input with autocomplete powered by OpenStreetMap Nominatim and quick-city chips.
     - **Date & Exact Time**: Date picker, time input, and "Reset to Current" button.
     - **Text Customization**: Main Title, Subtitle, and Footer with "Auto-fill Footer" generator.
     - **Typography Controls**: Dropdown for 5 Google Fonts (*Playfair Display*, *Montserrat*, *Cinzel*, *Great Vibes*, *Lato*) with separate font size sliders.
   - **Right Panel (Sticky Live Preview)**:
     - High-fidelity SVG poster preview maintaining exact poster aspect ratios (3:4 for 18×24, 2:3 for 24×36).
     - Real-time responsive stars and constellation lines.
     - Clipping masks (Circle and Bézier Heart).
     - Style 9 Curved border text using SVG `<textPath>`.
     - Zoom controls, reset zoom, and full-screen view.

3. **High-Resolution 300 DPI PDF Generation (`reportlab`)**:
   - Generates vector-native PDFs at 18×24" (1296 × 1728 pt) and 24×36" (1728 × 2592 pt).
   - Embedded Google Fonts via TrueType (`.ttf`) files.
   - Exact mathematical clipping paths: Circle or smooth cubic Bézier Heart.
   - Curved circular text positioning along the top perimeter for Style 9.
   - Constellations-only mode for Style 10 (omits scattered stars, highlighting constellation geometry).
   - High-resolution procedural teal watercolor texture for Styles 4 and 8.

---

## 🎨 The 10 Design Styles

| # | Style Name | Mask Shape | Background Color | Stars & Lines | Special Feature |
|---|------------|------------|------------------|---------------|-----------------|
| 1 | **Midnight Classic** | Circle | Deep Navy `#0B132B` | White stars & lines | Timeless classic aesthetic |
| 2 | **Vintage Monochrome** | Circle | Pure Black `#000000` | White stars & lines | Crisp white circular border rim |
| 3 | **Minimalist Light** | Circle | Pure White `#FFFFFF` | Charcoal `#333333` | Modern gallery minimalist |
| 4 | **Teal Watercolor** | Circle | Off-white `#F4F7F6` | White stars & lines | Deep teal/cyan organic textured mask |
| 5 | **Emerald Night** | Circle | Forest Green `#0A231A`| Radiant Gold `#D4AF37` | Luxury gold celestial accents |
| 6 | **Burgundy Sky** | Circle | Deep Wine `#4A0E17` | White stars & lines | Warm romantic tones |
| 7 | **The Heart (Navy)** | Heart | Deep Navy `#0B132B` | White stars & lines | Elegant romantic heart clipping mask |
| 8 | **The Heart (Teal)** | Heart | Off-white `#F4F7F6` | White stars & lines | Heart mask with teal watercolor texture |
| 9 | **Border Text** | Circle | Deep Navy `#0B132B` | White stars & lines | Primary title curves along upper circular rim |
| 10| **Constellations Only**| Circle | Pure Black `#000000` | White lines & nodes | Geometric constellation lines only |

---

## 🚀 Quick Start

To run both backend and frontend servers together:

```bash
cd /Users/Jure/.gemini/antigravity/scratch/star-map-generator
./start.sh
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Manual Startup

**Backend**:
```bash
cd /Users/Jure/.gemini/antigravity/scratch/star-map-generator
./backend/.venv/bin/uvicorn app.main:app --app-dir ./backend --host 127.0.0.1 --port 8000
```

**Frontend**:
```bash
export PATH="/Users/Jure/.gemini/antigravity/scratch/star-map-generator/tools/node-v20.18.0-darwin-x64/bin:$PATH"
cd /Users/Jure/.gemini/antigravity/scratch/star-map-generator/frontend
npm run dev
```

---

## 📁 Project Structure

```
star-map-generator/
├── backend/
│   ├── app/
│   │   ├── astronomy.py        # Skyfield celestial projection & Hipparcos catalog engine
│   │   ├── pdf_generator.py    # ReportLab 300 DPI vector PDF exporter (10 styles)
│   │   ├── watercolor.py       # Organic procedural watercolor texture generator
│   │   └── main.py             # FastAPI REST endpoints
│   ├── data/
│   │   ├── de421.bsp           # NASA JPL ephemeris
│   │   ├── hipparcos_filtered.parquet # Hipparcos star catalog
│   │   └── constellations.json # Stellarium constellation stick-figure lines
│   ├── fonts/                  # TrueType Google Fonts (Playfair, Montserrat, Cinzel, Great Vibes, Lato)
│   ├── tests/                  # Verification scripts & generated sample PDFs/PNGs
│   └── .venv/                  # Standalone Python 3.11 virtual environment
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css     # Google Fonts imports & Tailwind styles
│   │   │   ├── layout.tsx      # Next.js root layout
│   │   │   └── page.tsx        # Main split-screen application page
│   │   ├── components/
│   │   │   ├── Header.tsx      # Brand header with 300 DPI badge & export CTA
│   │   │   ├── ConfigPanel.tsx # Left-hand configuration panel
│   │   │   ├── StyleSelector.tsx # 10 Design styles visual thumbnails grid
│   │   │   └── StarMapPreview.tsx # Right-hand sticky SVG live preview
│   │   ├── constants/styles.ts # Style definitions & Google Fonts metadata
│   │   └── types/index.ts      # TypeScript interfaces
│   ├── next.config.js          # API proxy rewrites
│   ├── package.json
│   └── tailwind.config.js
├── tools/                      # Portable self-contained runtimes (Node.js LTS, Python 3.11, Astral uv)
├── start.sh                    # One-command dual server launcher
└── README.md
```
