import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { SpacetimeMap } from "./SpacetimeMap";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Point } from "../mesh";
import { ModernMenu } from "./ModernMenu";
import { City, DEFAULT_CITY, fetchCity } from "../cityData";
import { useMapSizePx } from "../useIsMobile";
import { useSearchParamsState } from "../useSearchParamsState";
import { ExplanationModal } from "./ExplanationModal";
import { ViewSettings, updateViewSettings } from "../viewSettings";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { useTouchGestures } from "../hooks/useTouchGestures";
import { FloatingActionButton, FloatingAction } from "./ui";
import { MultiCityComparison } from "./MultiCityComparison";
import { useAnimationControls } from "../hooks/useAnimationControls";

const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Animate timeness as a sinusoid. Spend a bit of time at 0 timeness
 * ("dip") to give the springs a bit of time to reset.
 */
const getTimenessForAnimation = (totalTime: number) => {
  const SECONDS_TO_SWITCH = 5;
  const DIP = 0.05; // "Dip" below the 0 point
  return clamp(
    Math.sin((totalTime * Math.PI * 2) / SECONDS_TO_SWITCH) * (0.5 + DIP) +
      (0.5 - DIP),
    0,
    1
  );
};

const triangleWave = (t: number, period: number) => {
  // Calculate the current phase of the wave, normalized to the range [0, 1]
  const phase = (t % period) / period;

  // Calculate the value of the triangle wave based on the phase
  // The wave increases linearly from 0 to 1 in the first half of the period
  // and decreases linearly from 1 to 0 in the second half
  if (phase < 0.5) {
    return 2 * phase; // Linearly increase
  } else {
    return 2 * (1 - phase); // Linearly decrease
  }
};

const App = () => {
  const [viewSettings, setViewSettings] = useLocalStorage<ViewSettings>(
    "SpacetimeMap.viewSettings",
    {
      animate: true,
      focusOnHover: true,
      showSpringArrows: false,
      showGridPoints: false,
      showGrid: true,
      showGridNumbers: false,
      showSpringsByDistance: false,
      showSpringsThreshold: 0,
    }
  );
  const [isPressed, setIsPressed] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [timeness, setTimeness] = useState(0);
  const [cityName, setCityName] = useSearchParamsState("city", DEFAULT_CITY);
  const [city, setCity] = useState<City | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [showExplantion, setShowExplantion] = useState(true);
  const [showMultiCity, setShowMultiCity] = useState(false);
  const [showInteractionHint, setShowInteractionHint] = useState(false);

  const mapSizePx = useMapSizePx();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  // Enhanced animation controls
  const { animationState, controls: animationControls } = useAnimationControls({
    onTimeChange: setTimeness,
  });

  // Enhanced keyboard shortcuts
  const { shortcuts, showHelp, setShowHelp } = useKeyboardShortcuts({
    viewSettings,
    setViewSettings,
    timeness,
    setTimeness,
    isMenuOpen,
    setMenuOpen,
    onInteraction: () => setShowInteractionHint(false),
  });

  // Touch gestures for mobile
  const { isGesturing } = useTouchGestures(appRef, {
    onSwipeLeft: () => {
      if (!isMenuOpen) setMenuOpen(true);
    },
    onSwipeRight: () => {
      if (isMenuOpen) setMenuOpen(false);
    },
    onSwipeUp: () => {
      setTimeness(Math.min(1, timeness + 0.1));
    },
    onSwipeDown: () => {
      setTimeness(Math.max(0, timeness - 0.1));
    },
    onDoubleTap: () => {
      setViewSettings({ ...viewSettings, animate: !viewSettings.animate });
    },
    onLongPress: () => {
      setShowHelp(true);
    },
  });

  // Mobile floating actions
  const floatingActions: FloatingAction[] = [
    {
      icon: "🎮",
      label: "Toggle Animation",
      onClick: () => animationControls.play(),
    },
    {
      icon: "🗺️",
      label: "Multi-City",
      onClick: () => setShowMultiCity(!showMultiCity),
    },
    {
      icon: "📱",
      label: "Toggle Menu",
      onClick: () => setMenuOpen(!isMenuOpen),
    },
    {
      icon: "⌨️",
      label: "Shortcuts",
      onClick: () => setShowHelp(true),
    },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      event.target instanceof Element &&
      !menuRef.current.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onTick = (deltaSeconds: number) => {
    setTotalTime(totalTime + deltaSeconds);
    if (viewSettings.showSpringsByDistance)
      setViewSettings({
        ...viewSettings,
        showSpringsThreshold: triangleWave(totalTime, 20),
      });
    if (viewSettings.animate) {
      setTimeness(getTimenessForAnimation(totalTime));
    } else {
      const SECONDS_TO_MAX = 0.2;
      let newTimeness =
        timeness + ((isPressed ? +1 : -1) * deltaSeconds) / SECONDS_TO_MAX;
      newTimeness = clamp(newTimeness, 0, 1);

      if (newTimeness === 1) {
        setShowExplantion(false);
      }

      setTimeness(newTimeness);
    }
  };

  useEffect(() => {
    fetchCity(cityName).then(
      (city) => {
        setCity(city);
      },
      (error) => {
        if (error.toString().includes("Unknown variable dynamic import")) {
          console.error(`City "${cityName}" not found, resetting`);
          setCityName(DEFAULT_CITY);
        } else {
          console.error("Error fetching city data", error);
        }
      }
    );
    // The setCityName dependency is missing, but I get an infinite loop if I add it.
  }, [cityName]);

  // Auto-hide explanation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExplantion(false);
      // Show interaction hint after explanation disappears
      setTimeout(() => setShowInteractionHint(true), 1000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide interaction hint after 10 seconds
  useEffect(() => {
    if (showInteractionHint) {
      const timer = setTimeout(() => {
        setShowInteractionHint(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showInteractionHint]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100"
      ref={appRef}
    >
      <div
        tabIndex={0}
        onPointerDown={(e) => {
          setIsPressed(true);
          setShowInteractionHint(false);
        }}
        onPointerUp={(e) => {
          setIsPressed(false);
        }}
        onPointerMove={(e) => {
          setHoveredPoint({
            x: e.clientX,
            y: e.clientY,
          });
        }}
        // I'm not sure why, but without these onTouch events, the hovered point doesn't
        // update properly on mobile, or only updates irregularly.
        onTouchStart={(e) => {
          setHoveredPoint({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          });
          setShowInteractionHint(false);
        }}
        onTouchMove={(e) => {
          setHoveredPoint({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          });
        }}
        onTouchEnd={(e) => {
          setHoveredPoint(null);
          setIsPressed(false);
        }}
        className="absolute -z-10 select-none"
      >
        {showExplantion && (
          <div onClick={() => setShowExplantion(false)}>
            <ExplanationModal />
          </div>
        )}
        <KeyboardShortcutsModal
          shortcuts={shortcuts}
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
        />

        {/* Multi-City Comparison Modal */}
        {showMultiCity && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Multi-City Comparison
                  </h2>
                  <button
                    onClick={() => setShowMultiCity(false)}
                    className="text-white hover:text-neutral-300 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                <MultiCityComparison
                  viewSettings={viewSettings}
                  timeness={timeness}
                  onTick={onTick}
                  mapSizePx={Math.min(mapSizePx / 2, 400)}
                />
              </div>
            </div>
          </div>
        )}
        {/* The Canvas wrapper replaces the PIXI Stage component */}
        <Canvas
          style={{ width: mapSizePx, height: mapSizePx }}
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
          gl={{
            antialias: true,
            alpha: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0xf8fafc, 1); // neutral-50 in hex
          }}
        >
          {city === null && (
            <group>
              <Text
                position={[0, 0, 0]}
                fontSize={24}
                color="black"
                anchorX="center"
                anchorY="middle"
              >
                🗺️ Loading Spacetime Map...
              </Text>
              <Text
                position={[0, -40, 0]}
                fontSize={14}
                color="#666666"
                anchorX="center"
                anchorY="middle"
              >
                Preparing {cityName} data
              </Text>
            </group>
          )}
          {!(city === null) && (
            <SpacetimeMap
              viewSettings={viewSettings}
              // This turned out to be confusing from a UX perspective, so let's disable it for now.
              hoveredPoint={hoveredPoint}
              // hoveredPoint={null}
              timeness={timeness}
              city={city}
              onTick={onTick}
            />
          )}
        </Canvas>
        {/* Place an invisible div over the canvas to intercept mouse events.
            This fixes drag-to-scroll on not working on mobile. */}
        <div className="absolute top-0 left-0 w-full h-full z-10"></div>
      </div>
      <ModernMenu
        ref={menuRef}
        timeness={timeness}
        setTimeness={setTimeness}
        isMenuOpen={isMenuOpen}
        setMenuOpen={setMenuOpen}
        cityName={cityName}
        setCityName={setCityName}
        viewSettings={viewSettings}
        setViewSettings={setViewSettings}
        onShowKeyboardHelp={() => setShowHelp(true)}
        onShowMultiCity={() => setShowMultiCity(true)}
      />

      {/* Animation Status Indicator */}
      {viewSettings.animate && (
        <div className="fixed top-4 right-4 z-40 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
          🎬 Animating
        </div>
      )}

      {/* Timeness Progress Indicator */}
      <div className="fixed bottom-4 right-4 z-40 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-600 mb-1">Space ← → Time</div>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${timeness * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {Math.round(timeness * 100)}%
        </div>
      </div>

      {/* Interaction Hint */}
      {showInteractionHint && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm animate-bounce">
          💡 Try pressing SPACE or dragging the map!
        </div>
      )}

      {/* Mobile Floating Action Button - only show on mobile */}
      <div className="md:hidden">
        <FloatingActionButton
          actions={floatingActions}
          position="bottom-left"
          size="md"
        />
      </div>
    </div>
  );
};

export default App;
