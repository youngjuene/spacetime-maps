/**
 * Advanced Three.js Features for Spacetime Maps
 * Provides enhanced visual effects and performance optimizations
 */

import * as THREE from "three";

export interface AdvancedRenderingOptions {
  enableBloom?: boolean;
  enableSSAO?: boolean;
  enableAntialiasing?: boolean;
  shadowMapEnabled?: boolean;
  shadowMapType?: THREE.ShadowMapType;
  toneMapping?: THREE.ToneMapping;
  toneMappingExposure?: number;
}

export class AdvancedThreeFeatures {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  /**
   * Setup advanced lighting system for better visual quality
   */
  setupAdvancedLighting(): {
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;
    pointLight: THREE.PointLight;
  } {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Directional light for main illumination
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);

    // Point light for accent lighting
    const pointLight = new THREE.PointLight(0x3b82f6, 0.5, 100);
    pointLight.position.set(0, 10, 0);
    this.scene.add(pointLight);

    return { ambientLight, directionalLight, pointLight };
  }

  /**
   * Create animated particle system for visual effects
   */
  createParticleSystem(count: number = 1000): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random positions
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      // Random colors
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Random sizes
      sizes[i] = Math.random() * 5 + 1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    return particles;
  }

  /**
   * Create instanced mesh for performance optimization
   */
  createInstancedMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    count: number
  ): THREE.InstancedMesh {
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

    // Set random transforms for each instance
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scale.setScalar(Math.random() * 0.5 + 0.5);

      matrix.compose(
        position,
        new THREE.Quaternion().setFromEuler(rotation),
        scale
      );
      instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
  }

  /**
   * Setup advanced renderer settings
   */
  setupAdvancedRenderer(options: AdvancedRenderingOptions = {}): void {
    // Enable shadows
    if (options.shadowMapEnabled !== false) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type =
        options.shadowMapType || THREE.PCFSoftShadowMap;
    }

    // Tone mapping for better color reproduction
    this.renderer.toneMapping =
      options.toneMapping || THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = options.toneMappingExposure || 1.0;

    // Output encoding for better color accuracy
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Enable physically correct lights
    this.renderer.useLegacyLights = false;
  }

  /**
   * Create animated shader material for special effects
   */
  createAnimatedShaderMaterial(): THREE.ShaderMaterial {
    const vertexShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        
        vec3 pos = position;
        pos.z += sin(pos.x * 0.1 + time) * 2.0;
        pos.z += cos(pos.y * 0.1 + time) * 2.0;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        float wave = sin(vPosition.x * 0.1 + time) * 0.5 + 0.5;
        vec3 finalColor = color * wave;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(0x3b82f6) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }

  /**
   * Create level-of-detail (LOD) system for performance
   */
  createLODSystem(
    highDetailGeometry: THREE.BufferGeometry,
    mediumDetailGeometry: THREE.BufferGeometry,
    lowDetailGeometry: THREE.BufferGeometry,
    material: THREE.Material
  ): THREE.LOD {
    const lod = new THREE.LOD();

    // High detail for close distances
    lod.addLevel(new THREE.Mesh(highDetailGeometry, material), 0);

    // Medium detail for medium distances
    lod.addLevel(new THREE.Mesh(mediumDetailGeometry, material), 50);

    // Low detail for far distances
    lod.addLevel(new THREE.Mesh(lowDetailGeometry, material), 100);

    return lod;
  }

  /**
   * Performance monitoring utilities
   */
  createPerformanceMonitor(): {
    stats: { fps: number; memory: number; drawCalls: number };
    update: () => void;
  } {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    const stats = {
      fps: 0,
      memory: 0,
      drawCalls: 0,
    };

    const update = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        stats.fps = fps;

        // Memory usage (if available)
        if ((performance as any).memory) {
          stats.memory = Math.round(
            (performance as any).memory.usedJSHeapSize / 1048576
          );
        }

        // Draw calls from renderer info
        stats.drawCalls = this.renderer.info.render.calls;

        frameCount = 0;
        lastTime = currentTime;
      }
    };

    return { stats, update };
  }

  /**
   * Create optimized geometry for large datasets
   */
  createOptimizedGeometry(
    vertices: Float32Array,
    indices: Uint32Array
  ): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    // Use efficient buffer attributes
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // Compute normals for lighting
    geometry.computeVertexNormals();

    // Compute bounding sphere for frustum culling
    geometry.computeBoundingSphere();

    return geometry;
  }
}

// Export utility functions
export const createAdvancedFeatures = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera
) => new AdvancedThreeFeatures(renderer, scene, camera);

export default AdvancedThreeFeatures;
