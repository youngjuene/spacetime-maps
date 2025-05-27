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

### **Option 3: Docker Development (Recommended for Teams)**

**Prerequisites:** Docker & Docker Compose

```bash
# Development with hot reload
docker-compose --profile dev up

# Production build
docker-compose --profile prod up

# Full stack (frontend + backend)
docker-compose --profile full up
```

### **Option 4: Production Deployment**

**Vercel (Recommended):**

```bash
cd frontend
npm run build
# Deploy build/ folder to Vercel
```

**Docker Production:**

```bash
docker build -t spacetime-maps .
docker run -p 80:80 spacetime-maps
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
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run test:ui      # Test UI
npm run lint         # Lint code
npm run format       # Format code
npm run type-check   # TypeScript check
```

### **Backend Development**

```bash
cd backend
poetry shell                    # Activate environment
poetry add package_name         # Add dependency
poetry run jupyter notebook     # Start Jupyter
```

### **Quality Assurance**

```bash
# Run all checks
npm run lint && npm run type-check && npm run test

# Performance testing
npm run build && npm run preview
# Then run Lighthouse on http://localhost:4173
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

## 🚀 **Production Deployment**

### **Environment Configuration**

Copy `frontend/env.example` to `frontend/.env`:

```bash
cp frontend/env.example frontend/.env
# Edit .env with your configuration
```

### **Build Optimization**

```bash
cd frontend
npm run build

# Check bundle size
npm run analyze

# Test production build locally
npm run preview
```

### **Deployment Options**

#### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### **Netlify**

```bash
cd frontend
npm run build
# Drag build/ folder to Netlify dashboard
```

#### **Docker Production**

```bash
# Build production image
docker build -t spacetime-maps .

# Run with environment variables
docker run -p 80:80 \
  -e NODE_ENV=production \
  spacetime-maps
```

#### **Static Hosting**

```bash
cd frontend
npm run build
# Upload build/ folder to any static host
# (GitHub Pages, AWS S3, etc.)
```

---

## 🔍 **Troubleshooting**

### **Frontend Issues**

- **Port in use**: Vite auto-uses next port (5174, 5175, etc.)
- **Build errors**: `rm -rf node_modules package-lock.json && npm install`
- **Large bundle**: Check `npm run analyze` for optimization opportunities
- **Performance**: Enable performance monitor in app settings

### **Backend Issues**

- **Poetry not found**: `export PATH="$HOME/.local/bin:$PATH"`
- **Import errors**: Make sure you're in `backend/` directory
- **API errors**: Verify `echo $GMAPS_API_KEY` shows your key

### **Docker Issues**

- **Build fails**: Check Docker has enough memory (4GB+)
- **Port conflicts**: Change ports in docker-compose.yml
- **Permission errors**: Run with `sudo` on Linux

### **Performance Issues**

- **Slow loading**: Check network tab for large assets
- **Low FPS**: Try different quality settings in app
- **Memory leaks**: Refresh page, check browser console

---

## 📊 **System Requirements**

### **Development**

- **Node.js**: 20.x LTS
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB for dependencies
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### **Production**

- **Server**: 1GB RAM, 1 CPU core minimum
- **CDN**: Recommended for global performance
- **HTTPS**: Required for modern browser features

### **Performance Expectations**

- **Initial Load**: <2s on modern devices
- **Frame Rate**: 60 FPS desktop, 30+ FPS mobile
- **Bundle Size**: <1MB gzipped
- **Memory Usage**: <100MB typical

---

## 🛡️ **Security & Stability**

### **Error Handling**

- **Error Boundaries**: Automatic error recovery
- **Graceful Degradation**: Fallbacks for WebGL issues
- **Performance Monitoring**: Real-time FPS tracking

### **Security Features**

- **CSP Headers**: Content Security Policy
- **HTTPS Only**: Secure connections required
- **No Sensitive Data**: All data is public
- **Dependency Scanning**: Automated vulnerability checks

### **Monitoring**

```bash
# Performance monitoring
npm run build && npm run preview
# Open http://localhost:4173 and check DevTools

# Bundle analysis
npm run analyze

# Lighthouse testing
npx lighthouse http://localhost:4173 --view
```

---

## 💡 **Tips**

1. **Start simple**: Use frontend-only setup first
2. **Explore cities**: Try different transportation modes
3. **Use shortcuts**: Space for play/pause, arrows for navigation
4. **Enable monitoring**: See real-time FPS and memory usage
5. **Try multi-city**: Compare cities side-by-side
6. **Check performance**: Use browser DevTools for optimization
7. **Use Docker**: For consistent development environment
8. **Monitor errors**: Check browser console for issues

**Happy mapping! 🗺️✨**
