#!/usr/bin/env python3
"""
Soft Mobility Spacetime Maps Backend API
FastAPI server for Google Maps integration and data processing
"""

import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

from backend.location import Location
from backend.gmaps import (
    get_distance_matrix, 
    get_static_map, 
    TravelMode,
    get_cache_stats,
    clear_expired_cache
)
from backend.grid import generate_grid, compute_spacetime_grid
from backend.cache import FileBasedCache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Soft Mobility Spacetime Maps API",
    description="Backend API for generating spacetime maps using Google Maps data",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize cache
cache = FileBasedCache()

# Pydantic models
class LocationRequest(BaseModel):
    lat: float
    lng: float

class DistanceMatrixRequest(BaseModel):
    origins: List[LocationRequest]
    destinations: List[LocationRequest]
    travel_mode: str = "WALK"

class SpacetimeGridRequest(BaseModel):
    center: LocationRequest
    radius_km: float = 5.0
    grid_size: int = 20
    travel_mode: str = "WALK"

class StaticMapRequest(BaseModel):
    center: LocationRequest
    zoom: int = 13
    size_pixels: int = 400
    markers: Optional[List[LocationRequest]] = None

# API Routes
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Soft Mobility Spacetime Maps API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for container monitoring"""
    api_key = os.getenv("GMAPS_API_KEY")
    return {
        "status": "healthy",
        "api_key_configured": bool(api_key),
        "cache_stats": get_cache_stats()
    }

@app.post("/api/distance-matrix")
async def compute_distance_matrix(request: DistanceMatrixRequest):
    """Compute travel time matrix between origins and destinations"""
    try:
        # Validate travel mode
        if request.travel_mode not in ["WALK", "DRIVE", "TRANSIT"]:
            raise HTTPException(status_code=400, detail="Invalid travel mode")
        
        # Convert to Location objects
        origins = [Location(lat=loc.lat, lng=loc.lng) for loc in request.origins]
        destinations = [Location(lat=loc.lat, lng=loc.lng) for loc in request.destinations]
        
        # Get travel mode enum
        travel_mode = TravelMode(request.travel_mode)
        
        # Compute distance matrix
        matrix_entries = list(get_distance_matrix(origins, destinations))
        
        return {
            "origins": len(origins),
            "destinations": len(destinations),
            "travel_mode": request.travel_mode,
            "matrix": matrix_entries
        }
        
    except Exception as e:
        logger.error(f"Distance matrix error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/spacetime-grid")
async def generate_spacetime_grid(request: SpacetimeGridRequest):
    """Generate spacetime grid data for visualization"""
    try:
        # Validate travel mode
        if request.travel_mode not in ["WALK", "DRIVE", "TRANSIT"]:
            raise HTTPException(status_code=400, detail="Invalid travel mode")
        
        center = Location(lat=request.center.lat, lng=request.center.lng)
        travel_mode = TravelMode(request.travel_mode)
        
        # Generate grid points
        grid_points = generate_grid(center, request.radius_km, request.grid_size)
        
        # Compute spacetime transformation
        spacetime_data = compute_spacetime_grid(
            center, grid_points, travel_mode
        )
        
        return {
            "center": {"lat": center.lat, "lng": center.lng},
            "radius_km": request.radius_km,
            "grid_size": request.grid_size,
            "travel_mode": request.travel_mode,
            "grid_data": spacetime_data
        }
        
    except Exception as e:
        logger.error(f"Spacetime grid error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/static-map")
async def get_map_image(request: StaticMapRequest):
    """Get static map image from Google Maps"""
    try:
        center = Location(lat=request.center.lat, lng=request.center.lng)
        markers = None
        if request.markers:
            markers = [Location(lat=m.lat, lng=m.lng) for m in request.markers]
        
        image_bytes = get_static_map(
            center=center,
            zoom=request.zoom,
            markers=markers,
            size_pixels=request.size_pixels
        )
        
        return JSONResponse(
            content={"image_size": len(image_bytes)},
            headers={"Content-Type": "application/json"}
        )
        
    except Exception as e:
        logger.error(f"Static map error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cache/stats")
async def cache_statistics():
    """Get cache statistics"""
    return get_cache_stats()

@app.post("/api/cache/clear")
async def clear_cache():
    """Clear expired cache entries"""
    removed = clear_expired_cache()
    return {"removed_entries": removed}

@app.get("/api/travel-modes")
async def get_travel_modes():
    """Get available travel modes"""
    return {
        "modes": [
            {"value": "WALK", "label": "Walking", "speed_kmh": 5},
            {"value": "DRIVE", "label": "Driving", "speed_kmh": 30},
            {"value": "TRANSIT", "label": "Public Transit", "speed_kmh": 20}
        ]
    }

if __name__ == "__main__":
    # Check for API key
    api_key = os.getenv("GMAPS_API_KEY")
    if not api_key:
        logger.warning("⚠️  GMAPS_API_KEY not set. API calls will fail.")
        logger.info("Set GMAPS_API_KEY environment variable for full functionality.")
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 