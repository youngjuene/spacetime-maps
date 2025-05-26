# Three.js Migration & Advanced Features

## Overview

This document details the successful migration from PIXI.js to Three.js and the advanced features implemented to enhance the spacetime maps visualization.

## Migration Summary

### What Changed

- **Rendering Engine**: PIXI.js 2D renderer → Three.js WebGL renderer
- **Component Architecture**: PIXI component patterns → React Three Fiber declarative approach
- **Animation Loop**: PIXI `useTick` → Three.js `useFrame`
- **Graphics Rendering**: Imperative PIXI Graphics → Declarative Three.js geometry

### Benefits Achieved

- **Enhanced 3D Capabilities**: Full 3D rendering pipeline with lighting, shadows, and effects
- **Better Performance**: Hardware-accelerated WebGL rendering with optimization features
- **Modern Architecture**: Declarative React Three Fiber components
- **Advanced Features**: Particle systems, shaders, LOD, instancing

## Core Components Migration

### 1. MeshTriangle Component

**Before (PIXI.js)**:

```typescript
const MeshTriangle = PixiComponent("MeshTriangle", {
  create: () => new PIXI.SimpleMesh(texture, vertices, uvs),
  applyProps: (instance, oldProps, newProps) => {
    // Imperative updates
  },
});
```

**After (Three.js)**:

```typescript
export default function MeshTriangle({ image, uvs, vertices }: Props) {
  const texture = useLoader(THREE.TextureLoader, image);
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    // Convert 2D vertices to 3D and set attributes
    return geom;
  }, [vertices, uvs]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
```

### 2. DebugOverlay Component

**Migration Highlights**:

- **Grid Points**: PIXI Graphics → Three.js Points with BufferGeometry
- **Grid Lines**: PIXI Graphics drawing → Three.js LineSegments
- **Spring Arrows**: Custom arrow geometry with Three.js Mesh
- **Performance**: Memoized geometry generation for better performance

### 3. SpacetimeMap Component

**Key Changes**:

- **Container**: PIXI Container → Three.js group
- **Animation**: `useTick` → `useFrame` with delta time
- **Coordinate System**: Handled Y-axis flip between PIXI and Three.js

### 4. App Component

**Canvas Setup**:

```typescript
<Canvas
  orthographic
  camera={{
    left: -mapSizePx / 2,
    right: mapSizePx / 2,
    top: mapSizePx / 2,
    bottom: -mapSizePx / 2,
    near: 0.1,
    far: 1000,
    position: [0, 0, 1],
  }}
  gl={{ antialias: true, alpha: true }}
>
  {/* Three.js content */}
</Canvas>
```

## Advanced Three.js Features

### 1. Performance Monitoring (`useThreePerformance`)

Real-time performance tracking with adaptive quality:

```typescript
const { stats, qualityLevel, isPerformanceGood } = useThreePerformance({
  targetFPS: 60,
  enableAdaptiveQuality: true,
  enableFrustumCulling: true,
  enableLOD: true,
});
```

**Features**:

- FPS monitoring with frame time averaging
- Memory usage tracking
- Draw call and triangle counting
- Automatic quality adjustment based on performance
- Geometry and material optimization

### 2. Advanced Rendering Features (`AdvancedThreeFeatures`)

#### Lighting System

```typescript
const { ambientLight, directionalLight, pointLight } =
  advancedFeatures.setupAdvancedLighting();
```

- **Ambient Light**: Overall scene illumination
- **Directional Light**: Main lighting with shadow casting
- **Point Light**: Accent lighting with color

#### Particle Systems

```typescript
const particles = advancedFeatures.createParticleSystem(1000);
```

- Dynamic particle generation with random colors and sizes
- Vertex color support for performance
- Configurable particle count and properties

#### Instanced Rendering

```typescript
const instancedMesh = advancedFeatures.createInstancedMesh(
  geometry,
  material,
  1000
);
```

- Efficient rendering of many similar objects
- Automatic matrix transformations
- Frustum culling enabled

#### Level of Detail (LOD)

```typescript
const lod = advancedFeatures.createLODSystem(
  highDetailGeometry,
  mediumDetailGeometry,
  lowDetailGeometry,
  material
);
```

- Automatic quality switching based on distance
- Performance optimization for large scenes
- Configurable distance thresholds

#### Custom Shaders

```typescript
const shaderMaterial = advancedFeatures.createAnimatedShaderMaterial();
```

- Animated vertex displacement
- Time-based color variations
- Custom GLSL shaders for special effects

### 3. Performance Optimization

#### Geometry Optimization

```typescript
const optimizedGeometry = ThreeCompatibilityLayer.createOptimizedGeometry(
  vertices,
  uvs,
  indices,
  normals
);
```

- Efficient BufferAttribute usage
- Automatic normal computation
- Bounding sphere calculation for frustum culling

#### Memory Management

```typescript
const { disposeObject } = useThreePerformance();
// Automatically dispose geometries and materials
disposeObject(meshObject);
```

- Automatic cleanup of GPU resources
- Memory leak prevention
- Efficient resource management

#### Batch Operations

```typescript
const { batchGeometryUpdates } = useThreePerformance();
batchGeometryUpdates(geometries, updateFunction);
```

- Minimize GPU state changes
- Efficient bulk operations
- Reduced draw call overhead

## Performance Monitoring Component

### Real-time Statistics Display

```typescript
<PerformanceMonitor enabled={true} position="top-right" compact={false} />
```

**Displays**:

- FPS with color-coded indicators
- Frame time in milliseconds
- Memory usage in MB
- Draw calls and triangle count
- Geometry and texture counts
- Performance status indicator

### Adaptive Quality System

The system automatically adjusts quality based on performance:

- **High Quality**: Full detail, all effects enabled
- **Medium Quality**: Reduced effects, moderate detail
- **Low Quality**: Minimal effects, basic rendering

Quality adjustments include:

- Material complexity (shininess, flat shading)
- LOD level selection
- Effect enabling/disabling
- Geometry detail reduction

## Integration Examples

### Adding Performance Monitoring to Existing Components

```typescript
import { PerformanceMonitor } from "./components/PerformanceMonitor";

function App() {
  return (
    <div>
      {/* Existing app content */}
      <PerformanceMonitor
        enabled={process.env.NODE_ENV === "development"}
        position="top-left"
        compact={true}
      />
    </div>
  );
}
```

### Using Advanced Features in Custom Components

```typescript
import { createAdvancedFeatures } from "../three/advanced-features";

function CustomVisualization() {
  const { gl, scene, camera } = useThree();
  const advancedFeatures = useMemo(
    () => createAdvancedFeatures(gl, scene, camera),
    [gl, scene, camera]
  );

  useEffect(() => {
    // Setup advanced lighting
    const lights = advancedFeatures.setupAdvancedLighting();

    // Create particle system
    const particles = advancedFeatures.createParticleSystem(500);
    scene.add(particles);

    return () => {
      // Cleanup
      scene.remove(particles);
    };
  }, [advancedFeatures, scene]);

  return null; // This component just sets up the scene
}
```

## Best Practices

### 1. Performance Optimization

- Use `useMemo` for expensive geometry calculations
- Implement LOD for complex scenes
- Enable frustum culling for off-screen objects
- Dispose of unused resources properly

### 2. Memory Management

- Monitor memory usage with performance tools
- Dispose geometries and materials when no longer needed
- Use instanced rendering for repeated objects
- Implement object pooling for dynamic content

### 3. Quality Settings

- Provide user controls for quality settings
- Implement adaptive quality for mobile devices
- Use performance monitoring to guide optimizations
- Test on various devices and browsers

### 4. Development Workflow

- Enable performance monitoring in development
- Use React DevTools Profiler for component optimization
- Monitor bundle size and loading performance
- Implement progressive loading for large assets

## Migration Checklist

- [x] **Core Components**: All PIXI components migrated to Three.js
- [x] **Animation System**: useFrame implementation with delta time
- [x] **Coordinate System**: Y-axis flip handling
- [x] **Performance Monitoring**: Real-time stats and adaptive quality
- [x] **Advanced Features**: Lighting, particles, LOD, shaders
- [x] **Memory Management**: Proper cleanup and disposal
- [x] **Documentation**: Comprehensive guides and examples
- [x] **Testing**: All tests passing with new dependencies
- [x] **Build System**: Updated dependencies and configurations

## Future Enhancements

### Planned Features

- **Post-processing Effects**: Bloom, SSAO, tone mapping
- **Advanced Shaders**: Custom materials and effects
- **VR/AR Support**: WebXR integration
- **Physics Integration**: Cannon.js or similar
- **Advanced Lighting**: IBL, PBR materials

### Performance Goals

- **60 FPS**: Maintain on all modern devices
- **Memory Efficiency**: <100MB typical usage
- **Loading Performance**: <2s initial load
- **Mobile Optimization**: Adaptive quality for mobile devices

## Conclusion

The migration from PIXI.js to Three.js has been successfully completed, providing:

1. **Enhanced Capabilities**: Full 3D rendering with advanced features
2. **Better Performance**: Hardware acceleration and optimization
3. **Modern Architecture**: Declarative React Three Fiber components
4. **Monitoring Tools**: Real-time performance tracking
5. **Future-Proof**: Foundation for advanced 3D features

The new Three.js implementation maintains all existing functionality while adding powerful new capabilities for visualization and performance optimization.
