# Google Maps API Setup & Multi-City Configuration Guide

## 🗝️ Google Maps API Key Setup

### Method 1: Environment Variable (Recommended)

The backend looks for the API key in the environment variable `GMAPS_API_KEY`.

#### For macOS/Linux:

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export GMAPS_API_KEY="your_actual_api_key_here"

# Or set it temporarily for the current session
export GMAPS_API_KEY="your_actual_api_key_here"
```

#### For Windows:

```cmd
# Command Prompt
set GMAPS_API_KEY=your_actual_api_key_here

# PowerShell
$env:GMAPS_API_KEY="your_actual_api_key_here"
```

### Method 2: .env File (Alternative)

Create a `.env` file in the backend directory:

```bash
# backend/.env
GMAPS_API_KEY=your_actual_api_key_here
```

Then modify the backend to load from .env:

```python
# backend/backend/gmaps.py
import os
from dotenv import load_dotenv

load_dotenv()

def get_api_key():
    return os.getenv("GMAPS_API_KEY")
```

### Method 3: Direct Configuration (Not Recommended for Production)

You can temporarily hardcode it for testing:

```python
# backend/backend/gmaps.py
def get_api_key():
    return "your_actual_api_key_here"  # Only for testing!
```

## 🔑 Getting Your Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable APIs**:
   - Google Maps Static API
   - Routes API (for distance matrix)
4. **Create credentials**:
   - Go to "Credentials" → "Create Credentials" → "API Key"
5. **Restrict your API key** (recommended):
   - Set application restrictions (HTTP referrers for web)
   - Set API restrictions to only the APIs you need

## 🏙️ Multi-City Functionality

The multi-city comparison feature is **already implemented** in your project! Here's how to use it:

### Accessing Multi-City View

1. **Start the application**:

   ```bash
   cd frontend
   npm run dev
   ```

2. **Open in browser**: `http://localhost:5173`

3. **Enable Multi-City Mode**:
   - Click the hamburger menu (☰)
   - Look for "Multi-City Comparison" toggle or button
   - Click "Add City" or the "+" button

### Multi-City Features

#### Layout Options

- **Grid Layout**: 2x2 arrangement for up to 4 cities
- **Horizontal**: Side-by-side comparison
- **Vertical**: Stacked vertically

#### Controls

- **Add Cities**: Click the "+" button to add more cities
- **Remove Cities**: Click the "✕" button on each city slot
- **Change Cities**: Use the dropdown in each slot to select different cities
- **Sync Animation**: Toggle synchronized playback across all cities
- **Individual Controls**: Each city can be controlled independently

#### Available Cities

The project includes pre-configured cities in `frontend/src/cityData.ts`:

- Prague (driving)
- London (transit)
- New York (transit)
- San Francisco (driving)
- And many more...

## 🚀 Running the Full Stack

### Backend Setup (for API functionality)

1. **Install dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set API key**:

   ```bash
   export GMAPS_API_KEY="your_actual_api_key_here"
   ```

3. **Start backend**:
   ```bash
   python -m backend.main
   ```

### Frontend Setup

1. **Install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Start frontend**:
   ```bash
   npm run dev
   ```

## 🎮 Using Multi-City Comparison

### Step-by-Step Guide

1. **Open the application** at `http://localhost:5173`

2. **Access Multi-City Mode**:

   - Click the menu button (☰) in the top-left
   - Look for "Multi-City" or "Comparison" option
   - Toggle it on or click "Add City"

3. **Add Cities**:

   - Click the "+" button to add a new city slot
   - Use the dropdown to select a city
   - Repeat to add more cities (up to 4 in grid mode)

4. **Configure Layout**:

   - Choose between Grid, Horizontal, or Vertical layouts
   - Adjust the layout based on your screen size and preference

5. **Control Animations**:
   - Use the sync toggle to synchronize all city animations
   - Or control each city individually
   - Adjust speed, play/pause, and timeline for each city

### Advanced Features

#### Synchronized Animation

```typescript
// The multi-city hook provides sync controls
const { state, controls } = useMultiCityComparison();

// Toggle sync mode
controls.toggleSync();

// All cities will animate together when sync is enabled
```

#### Custom City Configuration

You can add new cities by editing `frontend/src/cityData.ts`:

```typescript
export const CITIES = {
  // ... existing cities
  your_city: {
    displayName: "Your City",
    mode: "driving", // or "transit", "walking"
    // Add your city data here
  },
};
```

## 🔧 Troubleshooting

### API Key Issues

1. **"API key not found"**:

   - Verify the environment variable is set: `echo $GMAPS_API_KEY`
   - Restart your terminal/IDE after setting the variable

2. **"API key invalid"**:

   - Check the key is correct (no extra spaces)
   - Verify the APIs are enabled in Google Cloud Console

3. **"Quota exceeded"**:
   - Check your Google Cloud Console for usage limits
   - The app includes caching to reduce API calls

### Multi-City Issues

1. **Cities not loading**:

   - Check if the backend is running
   - Verify API key is configured
   - Check browser console for errors

2. **Performance issues with multiple cities**:
   - Enable the performance monitor to check FPS
   - Reduce the number of cities or use lower quality settings
   - The adaptive quality system should help automatically

## 💡 Tips for Best Experience

### Performance Optimization

- **Use caching**: The backend automatically caches API responses
- **Monitor performance**: Enable the performance monitor overlay
- **Limit cities**: Start with 2-3 cities for better performance

### Cost Management

- **API costs**: Distance Matrix API costs ~$0.005 per element
- **Caching**: The app caches results to minimize repeated API calls
- **Confirmation**: The app asks before making expensive API calls

### Development Tips

- **Test with frontend only**: Many features work without the backend
- **Use existing city data**: Start with pre-configured cities
- **Check logs**: Backend logs show cache hits and API usage

## 📊 Example Usage

### Basic Multi-City Setup

```bash
# Terminal 1: Backend
cd backend
export GMAPS_API_KEY="your_key_here"
python -m backend.main

# Terminal 2: Frontend
cd frontend
npm run dev

# Open http://localhost:5173
# Click menu → Enable Multi-City → Add cities
```

### Performance Monitoring

```typescript
// Enable performance monitoring in development
<PerformanceMonitor enabled={true} position="top-right" compact={false} />
```

The multi-city functionality is already fully implemented and ready to use! Just set up your API key and start exploring different cities side by side.
