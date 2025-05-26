import { useRef, useEffect, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface PerformanceStats {
  fps: number;
  frameTime: number;
  memory: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

export interface PerformanceSettings {
  targetFPS: number;
  enableAdaptiveQuality: boolean;
  enableFrustumCulling: boolean;
  enableLOD: boolean;
  maxDrawCalls: number;
}

export const useThreePerformance = (
  settings: Partial<PerformanceSettings> = {}
) => {
  const defaultSettings: PerformanceSettings = {
    targetFPS: 60,
    enableAdaptiveQuality: true,
    enableFrustumCulling: true,
    enableLOD: true,
    maxDrawCalls: 1000,
    ...settings,
  };

  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    memory: 0,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
  });

  const [qualityLevel, setQualityLevel] = useState<"high" | "medium" | "low">(
    "high"
  );
  const [isPerformanceGood, setIsPerformanceGood] = useState(true);

  const frameTimeRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  // Performance monitoring
  useFrame((state) => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    frameTimeRef.current.push(deltaTime);
    if (frameTimeRef.current.length > 60) {
      frameTimeRef.current.shift();
    }

    frameCountRef.current++;

    // Update stats every second
    if (frameCountRef.current % 60 === 0) {
      const avgFrameTime =
        frameTimeRef.current.reduce((a, b) => a + b, 0) /
        frameTimeRef.current.length;
      const fps = Math.round(1000 / avgFrameTime);

      const newStats: PerformanceStats = {
        fps,
        frameTime: avgFrameTime,
        memory: (performance as any).memory?.usedJSHeapSize / 1048576 || 0,
        drawCalls: state.gl.info.render.calls,
        triangles: state.gl.info.render.triangles,
        geometries: state.gl.info.memory.geometries,
        textures: state.gl.info.memory.textures,
      };

      setStats(newStats);

      // Adaptive quality adjustment
      if (defaultSettings.enableAdaptiveQuality) {
        const performanceGood = fps >= defaultSettings.targetFPS * 0.8;
        setIsPerformanceGood(performanceGood);

        if (!performanceGood && qualityLevel !== "low") {
          if (qualityLevel === "high") {
            setQualityLevel("medium");
          } else {
            setQualityLevel("low");
          }
        } else if (performanceGood && fps >= defaultSettings.targetFPS * 0.95) {
          if (qualityLevel === "low") {
            setQualityLevel("medium");
          } else if (qualityLevel === "medium") {
            setQualityLevel("high");
          }
        }
      }
    }

    lastTimeRef.current = currentTime;
  });

  // Optimization utilities
  const optimizeGeometry = useCallback(
    (geometry: THREE.BufferGeometry) => {
      // Compute bounding sphere for frustum culling
      geometry.computeBoundingSphere();

      // Dispose of unnecessary attributes based on quality level
      if (qualityLevel === "low") {
        // Remove normal attributes if not needed for lighting
        if (geometry.attributes.normal) {
          geometry.deleteAttribute("normal");
        }
      }

      return geometry;
    },
    [qualityLevel]
  );

  const optimizeMaterial = useCallback(
    (material: THREE.Material) => {
      // Adjust material quality based on performance
      switch (qualityLevel) {
        case "low":
          if (material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial) {
            material.flatShading = true;
          }
          if (material instanceof THREE.MeshPhongMaterial) {
            material.shininess = 1;
          }
          break;
        case "medium":
          if (material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial) {
            material.flatShading = false;
          }
          if (material instanceof THREE.MeshPhongMaterial) {
            material.shininess = 30;
          }
          break;
        case "high":
          if (material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial) {
            material.flatShading = false;
          }
          if (material instanceof THREE.MeshPhongMaterial) {
            material.shininess = 100;
          }
          break;
      }

      return material;
    },
    [qualityLevel]
  );

  const createLODMesh = useCallback(
    (
      highGeometry: THREE.BufferGeometry,
      mediumGeometry: THREE.BufferGeometry,
      lowGeometry: THREE.BufferGeometry,
      material: THREE.Material
    ) => {
      const lod = new THREE.LOD();

      // Add levels based on current quality setting
      switch (qualityLevel) {
        case "high":
          lod.addLevel(new THREE.Mesh(highGeometry, material), 0);
          lod.addLevel(new THREE.Mesh(mediumGeometry, material), 50);
          lod.addLevel(new THREE.Mesh(lowGeometry, material), 100);
          break;
        case "medium":
          lod.addLevel(new THREE.Mesh(mediumGeometry, material), 0);
          lod.addLevel(new THREE.Mesh(lowGeometry, material), 50);
          break;
        case "low":
          lod.addLevel(new THREE.Mesh(lowGeometry, material), 0);
          break;
      }

      return lod;
    },
    [qualityLevel]
  );

  // Memory management
  const disposeObject = useCallback((object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }, []);

  // Batch operations for better performance
  const batchGeometryUpdates = useCallback(
    (
      geometries: THREE.BufferGeometry[],
      updateFn: (geometry: THREE.BufferGeometry) => void
    ) => {
      // Batch updates to minimize GPU state changes
      geometries.forEach(updateFn);
    },
    []
  );

  return {
    stats,
    qualityLevel,
    isPerformanceGood,
    optimizeGeometry,
    optimizeMaterial,
    createLODMesh,
    disposeObject,
    batchGeometryUpdates,
    settings: defaultSettings,
  };
};

export default useThreePerformance;
