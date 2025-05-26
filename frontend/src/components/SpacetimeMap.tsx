import { useFrame } from "@react-three/fiber";

import { useEffect, useMemo, useState } from "react";
import { Point, VertexPosition, getMesh } from "../mesh";
import { DebugOverlay } from "./DebugOverlay";
import { Spring, routeMatrixToSprings, stepSprings } from "../springs";
import MeshTriangle from "./MeshTriangle";

import { GridData } from "../gridData";
import { City } from "../cityData";
import { useMapSizePx } from "../useIsMobile";
import { ViewSettings } from "../viewSettings";

/**
 * Create a mesh of triangles from individual MeshTriangle components.
 * Originally used PIXI.js SimpleMesh, now uses Three.js with React Three Fiber.
 * Each triangle is rendered as a separate component to avoid rendering issues.
 */
const createMeshTriangles = (
  vertexPositions: VertexPosition[],
  triangles: Float32Array[],
  flatUvs: Float32Array,
  mapSizePx: number,
  city: City
) => {
  let meshTriangles = triangles.map((triangle, i) => {
    // Convert normalized coordinates to Three.js world coordinates
    const curVertices = new Float32Array([
      (vertexPositions[triangle[0]].x - 0.5) * mapSizePx,
      (0.5 - vertexPositions[triangle[0]].y) * mapSizePx, // Flip Y for Three.js
      (vertexPositions[triangle[1]].x - 0.5) * mapSizePx,
      (0.5 - vertexPositions[triangle[1]].y) * mapSizePx,
      (vertexPositions[triangle[2]].x - 0.5) * mapSizePx,
      (0.5 - vertexPositions[triangle[2]].y) * mapSizePx,
    ]);

    const curUvs = new Float32Array([
      flatUvs[triangle[0] * 2],
      flatUvs[triangle[0] * 2 + 1],
      flatUvs[triangle[1] * 2],
      flatUvs[triangle[1] * 2 + 1],
      flatUvs[triangle[2] * 2],
      flatUvs[triangle[2] * 2 + 1],
    ]);

    return (
      <MeshTriangle
        // Include the city in the key because something goes wrong when we change the
        // city and the grid sizes aren't the same - the triangles seem to be shifted.
        // This is a simple hack to fix that.
        key={`${city.displayName}-${i}`}
        image={city.mapImage}
        uvs={new Float32Array(curUvs)}
        vertices={new Float32Array(curVertices)}
      />
    );
  });

  return meshTriangles;
};

export const SpacetimeMap = ({
  viewSettings,
  hoveredPoint,
  timeness,
  city,
  onTick,
}: {
  viewSettings: ViewSettings;
  hoveredPoint: Point | null;
  timeness: number;
  city: City;
  onTick: (deltaSeconds: number) => void;
}) => {
  const mapSizePx = useMapSizePx();

  const normalizedHoveredPoint = hoveredPoint
    ? {
        x: hoveredPoint.x / mapSizePx,
        y: hoveredPoint.y / mapSizePx,
      }
    : null;

  const getConstantGridData = () => {
    const gridData = city.data;

    const gridSize = gridData.size;

    const { grid, triangles } = getMesh(gridSize, gridData as GridData);

    const flatGrid = grid.flat();
    const initialPositions = flatGrid
      .map((entry) => ({
        x: entry.x,
        y: entry.y,
        pinned: false,
      }))
      .concat(
        flatGrid.map((entry) => ({
          x: entry.x,
          y: entry.y,
          pinned: true,
        }))
      );

    let springs: Spring[] = flatGrid.map((entry, i) => ({
      from: i,
      to: i + flatGrid.length,
      length: 0,
      strength: 1,
      isAnchor: true,
    }));
    springs = springs.concat(routeMatrixToSprings(gridData as GridData));

    const flatUvs = new Float32Array(
      grid
        .flat()
        .map((entry) => [entry.uvX, entry.uvY])
        .flat()
    );

    return {
      grid,
      initialPositions,
      triangles,
      springs,
      flatUvs,
    };
  };

  const { grid, initialPositions, triangles, springs, flatUvs } = useMemo(
    getConstantGridData,
    [city]
  );

  const [vertexPositions, setVertexPositions] = useState(initialPositions);

  // Reset the vertex positions when the grid changes.
  useEffect(() => {
    setVertexPositions(initialPositions);
  }, [initialPositions]);

  // Use useFrame instead of useTick for Three.js animation loop
  useFrame((state, delta) => {
    const deltaSeconds = delta; // delta is already in seconds in Three.js

    onTick(deltaSeconds);

    let [newVertexPositions, _] = stepSprings(
      vertexPositions,
      springs,
      deltaSeconds,
      viewSettings.focusOnHover ? normalizedHoveredPoint : null,
      // Different cities have different maxTimeness because the stretch
      // effect is less or more extreme depending on the data.
      timeness,
      city.maxTimeness
    );

    setVertexPositions(newVertexPositions);
  });

  const meshTriangles = createMeshTriangles(
    vertexPositions,
    triangles,
    flatUvs,
    mapSizePx,
    city
  );

  return (
    <>
      <group>
        {meshTriangles}
        <DebugOverlay
          vertexPositions={vertexPositions}
          grid={grid}
          springs={springs}
          viewSettings={viewSettings}
          normalizedHoveredPoint={normalizedHoveredPoint}
          mapSizePx={mapSizePx}
        />
      </group>
    </>
  );
};
