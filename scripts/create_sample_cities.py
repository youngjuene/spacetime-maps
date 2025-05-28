#!/usr/bin/env python3
"""
Script to create sample city data for South Korean and US cities.
This uses existing city data as templates and modifies them appropriately.
"""

import json
import shutil
import random
from pathlib import Path

# Define the frontend assets directory
ASSETS_DIR = Path("frontend/src/assets")

# City configurations with their template sources
CITY_CONFIGS = {
    # South Korean cities
    "seoul": {
        "template": "newyork",
        "scale_factor": 0.9,  # Seoul is very dense
        "description": "Seoul - Capital of South Korea with dense urban development"
    },
    "seoul_transit": {
        "template": "newyork_transit", 
        "scale_factor": 0.85,  # Excellent public transit
        "description": "Seoul Public Transit - One of the world's best subway systems"
    },
    "busan": {
        "template": "newyork",
        "scale_factor": 1.1,  # Coastal city, less dense
        "description": "Busan - South Korea's second largest city and major port"
    },
    "busan_transit": {
        "template": "newyork_transit",
        "scale_factor": 1.2,
        "description": "Busan Public Transit - Growing metro system"
    },
    "incheon": {
        "template": "newyork",
        "scale_factor": 1.3,  # Newer planned city
        "description": "Incheon - Modern port city near Seoul"
    },
    "incheon_transit": {
        "template": "newyork_transit",
        "scale_factor": 1.25,
        "description": "Incheon Public Transit - Connected to Seoul metro"
    },
    "daegu": {
        "template": "newyork",
        "scale_factor": 1.2,
        "description": "Daegu - Major city in southeastern South Korea"
    },
    "daegu_transit": {
        "template": "newyork_transit",
        "scale_factor": 1.3,
        "description": "Daegu Public Transit - Regional metro system"
    },
    
    # US cities
    "chicago": {
        "template": "newyork",
        "scale_factor": 1.1,  # Slightly less dense than NYC
        "description": "Chicago - Major US city with grid layout"
    },
    "chicago_transit": {
        "template": "newyork_transit",
        "scale_factor": 1.15,  # Good but not as comprehensive as NYC
        "description": "Chicago Public Transit - The 'L' system"
    },
    "losangeles_transit": {
        "template": "newyork_transit",
        "scale_factor": 1.8,  # LA is very spread out
        "description": "Los Angeles Public Transit - Growing metro system"
    }
}

def modify_route_matrix(route_matrix, scale_factor):
    """Modify route matrix by scaling durations."""
    modified_matrix = []
    for route in route_matrix:
        modified_route = route.copy()
        # Extract duration in seconds and scale it
        duration_str = route["duration"]
        duration_seconds = int(duration_str[:-1])  # Remove 's' suffix
        scaled_duration = int(duration_seconds * scale_factor)
        modified_route["duration"] = f"{scaled_duration}s"
        modified_matrix.append(modified_route)
    return modified_matrix

def modify_dense_travel_times(dense_times, scale_factor):
    """Modify dense travel times matrix by scaling values."""
    modified_times = []
    for row in dense_times:
        modified_row = []
        for cell in row:
            if cell is None:
                modified_row.append(None)
            elif cell == 0:
                modified_row.append(0)
            else:
                # Scale and add some random variation
                variation = random.uniform(0.9, 1.1)
                scaled_time = int(cell * scale_factor * variation)
                modified_row.append(scaled_time)
        modified_times.append(modified_row)
    return modified_times

def create_city_data(city_name, config):
    """Create data for a new city based on template."""
    template_name = config["template"]
    template_dir = ASSETS_DIR / template_name
    target_dir = ASSETS_DIR / city_name
    
    print(f"Creating {city_name} from template {template_name}...")
    
    # Create target directory
    target_dir.mkdir(exist_ok=True)
    
    # Copy and modify grid data
    template_grid_file = template_dir / "grid_data.json"
    target_grid_file = target_dir / "grid_data.json"
    
    if template_grid_file.exists():
        with open(template_grid_file, 'r') as f:
            grid_data = json.load(f)
        
        # Modify route matrix if it exists
        if "route_matrix" in grid_data and grid_data["route_matrix"]:
            grid_data["route_matrix"] = modify_route_matrix(
                grid_data["route_matrix"], config["scale_factor"]
            )
        
        # Modify dense travel times if it exists
        if "dense_travel_times" in grid_data and grid_data["dense_travel_times"]:
            grid_data["dense_travel_times"] = modify_dense_travel_times(
                grid_data["dense_travel_times"], config["scale_factor"]
            )
        
        # Update center location for different cities (simple offset for variety)
        if "center" in grid_data:
            center = grid_data["center"]
            # Add small random offsets to create different city centers
            lat_offset = random.uniform(-0.1, 0.1)
            lng_offset = random.uniform(-0.1, 0.1)
            center["lat"] += lat_offset
            center["lng"] += lng_offset
        
        with open(target_grid_file, 'w') as f:
            json.dump(grid_data, f, separators=(',', ':'))
        
        print(f"  ✓ Created grid_data.json")
    else:
        print(f"  ✗ Template grid data not found: {template_grid_file}")
    
    # Copy map image (use NYC map as placeholder for all)
    template_map = ASSETS_DIR / "newyork" / "map.png"
    target_map = target_dir / "map.png"
    
    if template_map.exists():
        shutil.copy2(template_map, target_map)
        print(f"  ✓ Copied map.png")
    else:
        print(f"  ✗ Template map not found: {template_map}")

def main():
    """Create all sample cities."""
    print("Creating sample city data for South Korea and USA cities...")
    print("=" * 60)
    
    # Set random seed for reproducible results
    random.seed(42)
    
    for city_name, config in CITY_CONFIGS.items():
        create_city_data(city_name, config)
        print()
    
    print("Sample city data creation completed!")
    print("\nNote: All cities use NYC map images as placeholders.")
    print("In production, you would replace these with actual city maps.")

if __name__ == "__main__":
    main() 