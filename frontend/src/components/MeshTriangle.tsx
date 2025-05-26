import { useRef, useMemo, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  image: string;
  uvs: Float32Array;
  vertices: Float32Array;
};

const indices = new Uint16Array([0, 1, 2]);

/**
 * This component works like the previous PIXI MeshTriangle but uses Three.js:
 * it renders a single triangle with texture mapping using React Three Fiber.
 * Converted from PIXI.js to Three.js implementation.
 */
export default function MeshTriangle({ image, uvs, vertices }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load texture using Three.js TextureLoader
  const texture = useLoader(THREE.TextureLoader, image);

  // Create geometry with vertices and UVs
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    // Convert 2D vertices to 3D (add z=0)
    const vertices3D = new Float32Array(9); // 3 vertices * 3 components
    for (let i = 0; i < 3; i++) {
      vertices3D[i * 3] = vertices[i * 2]; // x
      vertices3D[i * 3 + 1] = vertices[i * 2 + 1]; // y
      vertices3D[i * 3 + 2] = 0; // z
    }

    geom.setAttribute("position", new THREE.BufferAttribute(vertices3D, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));

    return geom;
  }, [vertices, uvs]);

  // Update geometry when vertices change
  useEffect(() => {
    if (meshRef.current && meshRef.current.geometry) {
      const vertices3D = new Float32Array(9);
      for (let i = 0; i < 3; i++) {
        vertices3D[i * 3] = vertices[i * 2];
        vertices3D[i * 3 + 1] = vertices[i * 2 + 1];
        vertices3D[i * 3 + 2] = 0;
      }

      meshRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices3D, 3)
      );
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [vertices]);

  // Update UVs when they change
  useEffect(() => {
    if (meshRef.current && meshRef.current.geometry) {
      meshRef.current.geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(uvs, 2)
      );
      meshRef.current.geometry.attributes.uv.needsUpdate = true;
    }
  }, [uvs]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
