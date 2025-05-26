import json
import hashlib
import time
from pathlib import Path
from typing import Optional, Dict, Any
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class CacheEntry:
    data: Dict[Any, Any]
    timestamp: float
    ttl: int  # Time to live in seconds

class FileBasedCache:
    def __init__(self, cache_dir: str = "cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        logger.info(f"Cache initialized at {self.cache_dir}")

    def _get_cache_key(self, origins, destinations, travel_mode):
        """Create deterministic hash from request parameters"""
        key_data = {
            'origins': [str(loc) for loc in origins],
            'destinations': [str(loc) for loc in destinations],
            'travel_mode': str(travel_mode)
        }
        return hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()

    def get(self, origins, destinations, travel_mode) -> Optional[Dict]:
        """Retrieve cached result if valid"""
        cache_key = self._get_cache_key(origins, destinations, travel_mode)
        cache_file = self.cache_dir / f"{cache_key}.json"

        if not cache_file.exists():
            logger.debug(f"Cache miss for key {cache_key[:8]}...")
            return None

        try:
            with open(cache_file, 'r') as f:
                entry_data = json.load(f)
                entry = CacheEntry(**entry_data)

            # Check if cache entry is still valid
            if time.time() - entry.timestamp > entry.ttl:
                cache_file.unlink()  # Remove expired cache
                logger.debug(f"Cache expired for key {cache_key[:8]}...")
                return None

            logger.info(f"Cache hit for key {cache_key[:8]}...")
            return entry.data
        except Exception as e:
            logger.warning(f"Cache read error for key {cache_key[:8]}...: {e}")
            return None

    def set(self, origins, destinations, travel_mode, data, ttl=3600):
        """Store result in cache"""
        cache_key = self._get_cache_key(origins, destinations, travel_mode)
        cache_file = self.cache_dir / f"{cache_key}.json"

        entry = CacheEntry(
            data=data,
            timestamp=time.time(),
            ttl=ttl
        )

        try:
            with open(cache_file, 'w') as f:
                json.dump(entry.__dict__, f)
            logger.info(f"Cached result for key {cache_key[:8]}...")
        except Exception as e:
            logger.warning(f"Cache write error for key {cache_key[:8]}...: {e}")

    def clear_expired(self):
        """Remove all expired cache entries"""
        current_time = time.time()
        removed_count = 0
        
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                with open(cache_file, 'r') as f:
                    entry_data = json.load(f)
                    entry = CacheEntry(**entry_data)
                
                if current_time - entry.timestamp > entry.ttl:
                    cache_file.unlink()
                    removed_count += 1
            except Exception:
                # Remove corrupted cache files
                cache_file.unlink()
                removed_count += 1
        
        logger.info(f"Removed {removed_count} expired cache entries")
        return removed_count

    def get_stats(self):
        """Get cache statistics"""
        cache_files = list(self.cache_dir.glob("*.json"))
        total_size = sum(f.stat().st_size for f in cache_files)
        
        return {
            "total_entries": len(cache_files),
            "total_size_bytes": total_size,
            "total_size_mb": total_size / (1024 * 1024),
            "cache_dir": str(self.cache_dir)
        } 