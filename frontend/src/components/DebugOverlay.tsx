import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { GridEntry, VertexPosition, Point } from "../mesh";
import { Spring, getForce } from "../springs";
import { ViewSettings } from "../viewSettings";
import { Text } from "@react-three/drei";

const getClosestMeshPoint = (
  point: Point,
  vertexPositions: VertexPosition[]
) => {
  let closestIndex = 0;
  let closestDist = Infinity;

  vertexPositions.forEach((p, i) => {
    if (p.pinned) return;
    const dist = Math.hypot(p.x - point.x, p.y - point.y);
    if (dist < closestDist) {
      closestDist = dist;
      closestIndex = i;
    }
  });
  return closestIndex;
};

const createArrowGeometry = (
  x: number,
  y: number,
  angle: number,
  scale: number = 1
): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry();

  // Create arrow shape vertices
  const vertices = new Float32Array([
    x + 10 * scale * Math.cos(angle + Math.PI / 2),
    y + 10 * scale * Math.sin(angle + Math.PI / 2),
    0,
    x + 10 * scale * Math.cos(angle - Math.PI / 2),
    y + 10 * scale * Math.sin(angle - Math.PI / 2),
    0,
    x + 20 * scale * Math.cos(angle),
    y + 20 * scale * Math.sin(angle),
    0,
  ]);

  const indices = new Uint16Array([0, 1, 2]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  return geometry;
};

const getForcesForEntry = (
  vertexPositions: VertexPosition[],
  springs: Spring[],
  index: number
): { entry: VertexPosition; force: number; spring: Spring }[] => {
  return springs
    .filter((spring) => spring.from === index || spring.to === index)
    .map((spring) => {
      const [iTo, iFrom] =
        spring.from === index
          ? [spring.to, spring.from]
          : [spring.from, spring.to];

      const from = vertexPositions[iFrom];
      const to = vertexPositions[iTo];

      const force = getForce(from, to, spring.length);

      return { entry: to, force, spring };
    });
};

const simpleHash = (data: string): number => {
  let hash = 0;
  if (data.length === 0) return hash;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

const hashPair = (num1: number, num2: number): number => {
  const pairString = `${num1},${num2}`;
  return simpleHash(pairString);
};

// Component for drawing grid points
function GridPoints({
  vertexPositions,
  mapSizePx,
}: {
  vertexPositions: VertexPosition[];
  mapSizePx: number;
}) {
  const pointsData = useMemo(() => {
    const pinnedPositions: number[] = [];
    const unpinnedPositions: number[] = [];

    vertexPositions.forEach((point) => {
      const x = (point.x - 0.5) * mapSizePx;
      const y = (0.5 - point.y) * mapSizePx;

      if (point.pinned) {
        pinnedPositions.push(x, y, 0);
      } else {
        unpinnedPositions.push(x, y, 0);
      }
    });

    return {
      pinned: new Float32Array(pinnedPositions),
      unpinned: new Float32Array(unpinnedPositions),
    };
  }, [vertexPositions, mapSizePx]);

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={pointsData.pinned}
            count={pointsData.pinned.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={0x555555} size={5} sizeAttenuation={false} />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={pointsData.unpinned}
            count={pointsData.unpinned.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={0xff000b} size={10} sizeAttenuation={false} />
      </points>
    </>
  );
}

// Component for drawing grid lines
function GridLines({
  vertexPositions,
  grid,
  mapSizePx,
}: {
  vertexPositions: VertexPosition[];
  grid: GridEntry[][];
  mapSizePx: number;
}) {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];

    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        const pos1 = vertexPositions[grid[x][y].index];
        const worldPos1 = {
          x: (pos1.x - 0.5) * mapSizePx,
          y: (0.5 - pos1.y) * mapSizePx,
        };

        if (x < grid.length - 1) {
          const pos2 = vertexPositions[grid[x + 1][y].index];
          const worldPos2 = {
            x: (pos2.x - 0.5) * mapSizePx,
            y: (0.5 - pos2.y) * mapSizePx,
          };
          points.push(
            new THREE.Vector3(worldPos1.x, worldPos1.y, 0),
            new THREE.Vector3(worldPos2.x, worldPos2.y, 0)
          );
        }

        if (y < grid[x].length - 1) {
          const pos2 = vertexPositions[grid[x][y + 1].index];
          const worldPos2 = {
            x: (pos2.x - 0.5) * mapSizePx,
            y: (0.5 - pos2.y) * mapSizePx,
          };
          points.push(
            new THREE.Vector3(worldPos1.x, worldPos1.y, 0),
            new THREE.Vector3(worldPos2.x, worldPos2.y, 0)
          );
        }
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [vertexPositions, grid, mapSizePx]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color={0x555555} opacity={0.5} transparent />
    </lineSegments>
  );
}

// Component for drawing spring arrows
function SpringArrows({
  vertexPositions,
  springs,
  normalizedHoveredPoint,
  mapSizePx,
}: {
  vertexPositions: VertexPosition[];
  springs: Spring[];
  normalizedHoveredPoint: Point | null;
  mapSizePx: number;
}) {
  const arrowsData = useMemo(() => {
    if (!normalizedHoveredPoint) return null;

    const closestIndex = getClosestMeshPoint(
      normalizedHoveredPoint,
      vertexPositions
    );
    const closestMeshPoint = vertexPositions[closestIndex];
    const forces = getForcesForEntry(vertexPositions, springs, closestIndex);

    return {
      closestPoint: {
        x: (closestMeshPoint.x - 0.5) * mapSizePx,
        y: (0.5 - closestMeshPoint.y) * mapSizePx,
      },
      forces: forces.map(({ entry, force, spring }) => {
        const from = closestMeshPoint;
        const to = entry;

        let angle = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
        const distanceRatio =
          Math.hypot(to.x - from.x, to.y - from.y) / spring.length;

        if (distanceRatio < 1) {
          angle += Math.PI;
        }

        const pushingAway = force < 0;

        return {
          x: (entry.x - 0.5) * mapSizePx,
          y: (0.5 - entry.y) * mapSizePx,
          angle: angle + Math.PI / 2,
          scale: 2 * Math.sqrt(Math.abs(force)),
          color: pushingAway ? 0xef767a : 0x2f52e0,
        };
      }),
    };
  }, [vertexPositions, springs, normalizedHoveredPoint, mapSizePx]);

  if (!arrowsData) return null;

  return (
    <>
      {/* Closest point indicator */}
      <mesh
        position={[arrowsData.closestPoint.x, arrowsData.closestPoint.y, 0]}
      >
        <circleGeometry args={[10, 16]} />
        <meshBasicMaterial color={0x000000} opacity={0.5} transparent />
      </mesh>

      {/* Force arrows */}
      {arrowsData.forces.map((arrow, index) => (
        <mesh
          key={index}
          position={[arrow.x, arrow.y, 0]}
          geometry={createArrowGeometry(0, 0, arrow.angle, arrow.scale)}
        >
          <meshBasicMaterial color={arrow.color} opacity={0.8} transparent />
        </mesh>
      ))}
    </>
  );
}

// Component for drawing springs by distance
function SpringsByDistance({
  vertexPositions,
  springs,
  viewSettings,
  mapSizePx,
}: {
  vertexPositions: VertexPosition[];
  springs: Spring[];
  viewSettings: ViewSettings;
  mapSizePx: number;
}) {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];

    springs.forEach((spring) => {
      const from = vertexPositions[spring.from];
      const to = vertexPositions[spring.to];
      if (from.pinned || to.pinned) return;

      const length = Math.hypot(from.x - to.x, from.y - to.y);
      if (length > viewSettings.showSpringsThreshold) return;

      // Only show a subset of the springs
      if (hashPair(spring.from, spring.to) % 32 !== 0) {
        return;
      }

      const fromWorld = {
        x: (from.x - 0.5) * mapSizePx,
        y: (0.5 - from.y) * mapSizePx,
      };
      const toWorld = {
        x: (to.x - 0.5) * mapSizePx,
        y: (0.5 - to.y) * mapSizePx,
      };

      points.push(
        new THREE.Vector3(fromWorld.x, fromWorld.y, 0),
        new THREE.Vector3(toWorld.x, toWorld.y, 0)
      );
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [vertexPositions, springs, viewSettings, mapSizePx]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color={0x000000} opacity={0.1} transparent />
    </lineSegments>
  );
}

// Component for drawing grid numbers
function GridNumbers({
  vertexPositions,
  mapSizePx,
}: {
  vertexPositions: VertexPosition[];
  mapSizePx: number;
}) {
  const numbers = vertexPositions
    .slice(0, vertexPositions.length / 2)
    .map((point, i) => {
      const x = (point.x - 0.5) * mapSizePx - 15;
      const y = (0.5 - point.y) * mapSizePx - 15;

      return (
        <Text key={i} position={[x, y, 0]} fontSize={12} color="black">
          {i.toString()}
        </Text>
      );
    });

  return <>{numbers}</>;
}

export const DebugOverlay = ({
  vertexPositions,
  grid,
  springs,
  viewSettings,
  normalizedHoveredPoint,
  mapSizePx,
}: {
  vertexPositions: VertexPosition[];
  grid: GridEntry[][];
  springs: Spring[];
  viewSettings: ViewSettings;
  normalizedHoveredPoint: Point | null;
  mapSizePx: number;
}) => {
  return (
    <>
      {viewSettings.showSpringArrows && (
        <SpringArrows
          vertexPositions={vertexPositions}
          springs={springs}
          normalizedHoveredPoint={normalizedHoveredPoint}
          mapSizePx={mapSizePx}
        />
      )}
      {viewSettings.showGridNumbers && (
        <GridNumbers vertexPositions={vertexPositions} mapSizePx={mapSizePx} />
      )}
      {viewSettings.showGridPoints && (
        <GridPoints vertexPositions={vertexPositions} mapSizePx={mapSizePx} />
      )}
      {viewSettings.showGrid && (
        <GridLines
          vertexPositions={vertexPositions}
          grid={grid}
          mapSizePx={mapSizePx}
        />
      )}
      {viewSettings.showSpringsByDistance && (
        <SpringsByDistance
          vertexPositions={vertexPositions}
          springs={springs}
          viewSettings={viewSettings}
          mapSizePx={mapSizePx}
        />
      )}
    </>
  );
};
