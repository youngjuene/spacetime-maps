/**
 * Three.js Compatibility Layer
 * Provides a unified interface for Three.js operations
 * Replaces the PIXI.js compatibility layer
 */

import * as THREE from "three";

export interface CompatibilityRendererOptions {
  width?: number;
  height?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  antialias?: boolean;
  devicePixelRatio?: number;
  preserveDrawingBuffer?: boolean;
  powerPreference?: "default" | "high-performance" | "low-power";
}

export interface CompatibilityTextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: "normal" | "italic" | "oblique";
  fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number | string;
  color?: number | string;
  align?: "left" | "center" | "right" | "justify";
  strokeColor?: number | string;
  strokeWidth?: number;
}

export class ThreeCompatibilityLayer {
  /**
   * Create Three.js Renderer with compatibility options
   */
  static createRenderer(
    options: CompatibilityRendererOptions = {}
  ): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: options.antialias ?? true,
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
      powerPreference: options.powerPreference || "default",
    });

    renderer.setSize(options.width || 800, options.height || 600);

    renderer.setPixelRatio(
      options.devicePixelRatio || window.devicePixelRatio || 1
    );

    // Set background color
    if (options.backgroundColor !== undefined) {
      renderer.setClearColor(
        options.backgroundColor,
        options.backgroundAlpha ?? 1
      );
    } else {
      renderer.setClearColor(0x1099bb, 1);
    }

    return renderer;
  }

  /**
   * Create Three.js Scene
   */
  static createScene(): THREE.Scene {
    return new THREE.Scene();
  }

  /**
   * Create Three.js Camera
   */
  static createOrthographicCamera(
    width: number,
    height: number,
    near: number = 0.1,
    far: number = 1000
  ): THREE.OrthographicCamera {
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      near,
      far
    );
    camera.position.z = 1;
    return camera;
  }

  /**
   * Create Three.js Group (equivalent to PIXI Container)
   */
  static createGroup(): THREE.Group {
    return new THREE.Group();
  }

  /**
   * Create Three.js Mesh with geometry and material
   */
  static createMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material
  ): THREE.Mesh {
    return new THREE.Mesh(geometry, material);
  }

  /**
   * Create Three.js BufferGeometry for triangles
   */
  static createTriangleGeometry(
    vertices: Float32Array,
    uvs: Float32Array,
    indices?: Uint16Array
  ): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    if (indices) {
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }

    return geometry;
  }

  /**
   * Create Three.js Material with texture
   */
  static createMeshBasicMaterial(
    texture?: THREE.Texture,
    options: {
      transparent?: boolean;
      opacity?: number;
      side?: THREE.Side;
    } = {}
  ): THREE.MeshBasicMaterial {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: options.transparent ?? true,
      opacity: options.opacity ?? 1,
      side: options.side ?? THREE.FrontSide,
    });
  }

  /**
   * Create Three.js Texture from image URL
   */
  static createTextureFromImage(imageUrl: string): THREE.Texture {
    const loader = new THREE.TextureLoader();
    return loader.load(imageUrl);
  }

  /**
   * Create Three.js Line for drawing connections
   */
  static createLine(
    points: THREE.Vector3[],
    color: number = 0x000000,
    lineWidth: number = 1
  ): THREE.Line {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: lineWidth,
    });
    return new THREE.Line(geometry, material);
  }

  /**
   * Create Three.js Points for drawing circles/dots
   */
  static createPoints(
    positions: Float32Array,
    color: number = 0x000000,
    size: number = 5
  ): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: color,
      size: size,
      sizeAttenuation: false,
    });

    return new THREE.Points(geometry, material);
  }

  /**
   * Handle resize compatibility
   */
  static resizeRenderer(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    width: number,
    height: number
  ): void {
    renderer.setSize(width, height);

    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    } else if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  /**
   * Convert hex color to Three.js Color
   */
  static hexToColor(hex: number): THREE.Color {
    return new THREE.Color(hex);
  }

  /**
   * Convert normalized coordinates to Three.js world coordinates
   */
  static normalizedToWorld(
    x: number,
    y: number,
    width: number,
    height: number
  ): { x: number; y: number } {
    return {
      x: (x - 0.5) * width,
      y: (0.5 - y) * height, // Flip Y axis for Three.js
    };
  }

  /**
   * Convert world coordinates to normalized coordinates
   */
  static worldToNormalized(
    x: number,
    y: number,
    width: number,
    height: number
  ): { x: number; y: number } {
    return {
      x: x / width + 0.5,
      y: 0.5 - y / height, // Flip Y axis from Three.js
    };
  }

  /**
   * Get Three.js version information
   */
  static getVersionInfo(): {
    version: string;
    majorVersion: number;
    isModern: boolean;
  } {
    const version = THREE.REVISION;
    const majorVersion = parseInt(version.toString().substring(0, 3));

    return {
      version: version.toString(),
      majorVersion,
      isModern: majorVersion >= 150,
    };
  }

  /**
   * Log compatibility information
   */
  static logCompatibilityInfo(): void {
    const info = this.getVersionInfo();

    console.log(`🎮 Three.js Compatibility Layer`);
    console.log(`📦 Three.js Version: ${info.version}`);
    console.log(`🔢 Major Version: ${info.majorVersion}`);
    console.log(`✨ Modern Version: ${info.isModern ? "Yes" : "No"}`);
  }

  /**
   * Create optimized geometry with performance enhancements
   */
  static createOptimizedGeometry(
    vertices: Float32Array,
    uvs?: Float32Array,
    indices?: Uint16Array | Uint32Array,
    normals?: Float32Array
  ): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    // Set position attribute
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Set UV attribute if provided
    if (uvs) {
      geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    }

    // Set indices if provided
    if (indices) {
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }

    // Set normals or compute them
    if (normals) {
      geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    } else {
      geometry.computeVertexNormals();
    }

    // Compute bounding sphere for frustum culling
    geometry.computeBoundingSphere();

    return geometry;
  }

  /**
   * Create instanced mesh for rendering many similar objects efficiently
   */
  static createInstancedMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    count: number
  ): THREE.InstancedMesh {
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

    // Enable frustum culling
    instancedMesh.frustumCulled = true;

    return instancedMesh;
  }

  /**
   * Setup performance-optimized renderer
   */
  static setupPerformanceRenderer(
    renderer: THREE.WebGLRenderer,
    options: {
      enableShadows?: boolean;
      shadowMapType?: THREE.ShadowMapType;
      antialias?: boolean;
      powerPreference?: "default" | "high-performance" | "low-power";
    } = {}
  ): void {
    // Enable shadows if requested
    if (options.enableShadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = options.shadowMapType || THREE.PCFSoftShadowMap;
    }

    // Set power preference for mobile optimization
    if (options.powerPreference) {
      // This would need to be set during renderer creation
      console.log(`Power preference: ${options.powerPreference}`);
    }

    // Enable physically correct lights
    renderer.useLegacyLights = false;

    // Set output color space
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Enable tone mapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
  }
}

// Export commonly used Three.js types for convenience
export { THREE };

// Export specific classes that are commonly used
export {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PerspectiveCamera,
  Group,
  Mesh,
  BufferGeometry,
  MeshBasicMaterial,
  Texture,
  TextureLoader,
  Line,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  Vector3,
  Color,
  InstancedMesh,
  LOD,
  ShaderMaterial,
} from "three";
