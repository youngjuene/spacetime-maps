# Spacetime Maps - Setup Guide

## 🚀 **Quick Start**

```bash
# Clone and run (frontend only - fully functional!)
git clone https://github.com/yourusername/spacetime-maps.git
cd spacetime-maps/frontend
npm install
npm run dev
# Open http://localhost:5173
```

**That's it!** The application works completely standalone with pre-existing city data for 15+ cities.

---

## 🏗️ **Architecture Overview**

- ✅ **Frontend**: React + Three.js application (fully functional standalone)
- ✅ **Data**: Pre-configured city data (NYC, Prague, London, Zurich, LA, Cairo, Hong Kong, etc.)
- ⚠️ **Backend**: Python utilities for data generation (optional, not a web server)

---

## 📋 **Setup Options**

### **Option 1: Frontend Only (Recommended)**

**Prerequisites:** Node.js 20.x LTS

```bash
cd frontend
npm install
npm run dev
```

**Features available:**

- Interactive 3D spacetime maps
- Animation controls and timeline scrubbing
- Multi-city comparison (side-by-side, grid layouts)
- Touch gestures and keyboard shortcuts
- Performance monitoring

### **Option 2: Backend for Data Generation (Optional)**

**Prerequisites:** Python 3.9+, Google Maps API key

#### **Using Poetry (Recommended)**

```bash
cd backend

# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$HOME/.local/bin:$PATH"

# Install dependencies
poetry install

# Test setup
poetry run python -c "from backend.gmaps import get_api_key; print('✅ Setup complete!')"
```

#### **Using pip (Alternative)**

```bash
cd backend
pip install -r requirements.txt
```

---

## 🗝️ **Google Maps API Setup**

Only needed for generating new city data.

### **1. Get API Key**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable "Routes API" and "Maps Static API"
- Create an API key

### **2. Set Environment Variable**

```bash
export GMAPS_API_KEY="your_actual_api_key_here"

# For persistence, add to your shell profile:
echo 'export GMAPS_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

### **3. Usage Examples**

```bash
# Activate Poetry environment
cd backend
poetry shell

# Generate travel time data
poetry run python -c "
from backend.gmaps import call_distance_matrix_api, TravelMode
from backend.location import Location

origins = [Location(lat=40.7128, lng=-74.0060)]  # NYC
destinations = [Location(lat=40.7589, lng=-73.9851)]  # Times Square
response = call_distance_matrix_api(origins, destinations, travel_mode=TravelMode.DRIVE)
print('✅ Travel time data generated!')
"
```

---

## 🎮 **Using the Application**

### **Basic Controls**

- **Mouse/Touch**: Drag to pan, scroll/pinch to zoom
- **Keyboard**: Space = play/pause, arrows = navigate

### **Multi-City Comparison**

1. Click the hamburger menu (☰)
2. Click "Add City" or the "+" button
3. Select cities from dropdowns
4. Choose layout (grid, horizontal, vertical)
5. Toggle sync animation or control individually

### **Keyboard Shortcuts**

- `Space` - Play/pause animation
- `←/→` - Step animation backward/forward
- `↑/↓` - Increase/decrease animation speed
- `G` - Toggle grid overlay
- `M` - Toggle menu

---

## 🔧 **Development**

### **Frontend Development**

```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
```

### **Backend Development**

```bash
cd backend
poetry shell                    # Activate environment
poetry add package_name         # Add dependency
poetry run jupyter notebook     # Start Jupyter
```

### **Adding New Cities**

Edit `frontend/src/cityData.ts`:

```typescript
export const CITIES = {
  your_city: {
    displayName: "Your City",
    mode: "driving", // or "transit", "walking"
    maxTimeness: 0.15,
  },
};
```

---

## 🔍 **Troubleshooting**

### **Frontend Issues**

- **Port in use**: Vite auto-uses next port (5174, 5175, etc.)
- **Build errors**: `rm -rf node_modules package-lock.json && npm install`

### **Backend Issues**

- **Poetry not found**: `export PATH="$HOME/.local/bin:$PATH"`
- **Import errors**: Make sure you're in `backend/` directory
- **API errors**: Verify `echo $GMAPS_API_KEY` shows your key

### **Performance Issues**

- Enable performance monitor in app settings
- Try different quality settings
- Check browser console for errors

---

## 📊 **System Requirements**

**Minimum:**

- Node.js 18.x+, 2GB RAM, Modern browser

**Recommended:**

- Node.js 20.x LTS, 4GB RAM, Dedicated graphics card

---

## 🚀 **Deployment**

### **Static Hosting (Frontend Only)**

```bash
cd frontend
npm run build
# Deploy frontend/build/ to Vercel, Netlify, GitHub Pages, etc.
```

### **Performance Expectations**

- Initial Load: <2s on modern devices
- Frame Rate: 60 FPS desktop, 30+ FPS mobile
- Bundle Size: <1MB gzipped
- Memory Usage: <100MB typical

---

## 💡 **Tips**

1. **Start simple**: Use frontend-only setup first
2. **Explore cities**: Try different transportation modes
3. **Use shortcuts**: Space for play/pause, arrows for navigation
4. **Enable monitoring**: See real-time FPS and memory usage
5. **Try multi-city**: Compare cities side-by-side

**Happy mapping! 🗺️✨**
