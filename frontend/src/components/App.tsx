import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { SpacetimeMap } from "./SpacetimeMap";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Point } from "../mesh";
import { ModernMenu } from "./ModernMenu";
import { City, DEFAULT_CITY, fetchCity, CityName } from "../cityData";
import { useMapSizePx } from "../useIsMobile";
import { useSearchParamsState } from "../useSearchParamsState";
import { ExplanationModal } from "./ExplanationModal";
import { ViewSettings, updateViewSettings } from "../viewSettings";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { useTouchGestures } from "../hooks/useTouchGestures";
import { FloatingActionButton, FloatingAction } from "./ui";
import { SoftMobilityComparison } from "./SoftMobilityComparison";
import { useAnimationControls } from "../hooks/useAnimationControls";

const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Animate timeness as a sinusoid for soft mobility demonstration
 */
const getTimenessForAnimation = (totalTime: number) => {
  const SECONDS_TO_SWITCH = 6; // Slightly slower for better soft mobility observation
  const DIP = 0.05;
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
    "SoftMobilityMap.viewSettings",
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
  const [showExplanation, setShowExplanation] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [showInteractionHint, setShowInteractionHint] = useState(false);

  const mapSizePx = useMapSizePx();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  // Enhanced animation controls for soft mobility
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

  // Touch gestures for mobile soft mobility interaction
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
      setShowComparison(!showComparison);
    },
    onLongPress: () => {
      setShowHelp(true);
    },
  });

  // Mobile floating actions for soft mobility
  const floatingActions: FloatingAction[] = [
    {
      icon: "🚶",
      label: "Toggle Animation",
      onClick: () => animationControls.play(),
    },
    {
      icon: "🏃‍♂️",
      label: "Compare Cities",
      onClick: () => setShowComparison(!showComparison),
    },
    {
      icon: "🚴",
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
    if (viewSettings.animate) {
      setTimeness(getTimenessForAnimation(totalTime));
    } else {
      const SECONDS_TO_MAX = 0.3; // Slightly slower for soft mobility observation
      let newTimeness =
        timeness + ((isPressed ? +1 : -1) * deltaSeconds) / SECONDS_TO_MAX;
      newTimeness = clamp(newTimeness, 0, 1);

      if (newTimeness === 1) {
        setShowExplanation(false);
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
          console.error(`City "${cityName}" not found, resetting to default`);
          setCityName(DEFAULT_CITY);
        } else {
          console.error("Error fetching soft mobility data", error);
        }
      }
    );
  }, [cityName]);

  const handleCitySelect = (selectedCityName: CityName) => {
    setCityName(selectedCityName);
    setShowComparison(false);
  };

  return (
    <div
      ref={appRef}
      className="w-screen h-screen bg-gray-100 relative overflow-hidden"
    >
      {/* Main Content */}
      {showComparison ? (
        <SoftMobilityComparison
          viewSettings={viewSettings}
          timeness={timeness}
          onCitySelect={handleCitySelect}
        />
      ) : (
        <div className="w-full h-full relative">
          {/* Single City View */}
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            onCreated={({ gl }) => {
              gl.setSize(window.innerWidth, window.innerHeight);
            }}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            onPointerLeave={() => setIsPressed(false)}
          >
            {city && (
              <SpacetimeMap
                city={city}
                timeness={timeness}
                viewSettings={viewSettings}
                hoveredPoint={hoveredPoint}
                onTick={onTick}
              />
            )}
          </Canvas>

          {/* City Info Overlay */}
          {city && (
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg max-w-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {city.displayName}
              </h2>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Mode:</span>{" "}
                  <span className="capitalize">{city.mode}</span>
                </p>
                <p>
                  <span className="font-medium">Speed:</span>{" "}
                  {city.avgSpeed.kmh} km/h
                </p>
                <p>
                  <span className="font-medium">Population:</span>{" "}
                  {city.population.toLocaleString()}
                </p>
                {city.walkabilityScore && (
                  <p>
                    <span className="font-medium">Walkability:</span>{" "}
                    {city.walkabilityScore}/100
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-2">{city.description}</p>
              </div>
            </div>
          )}

          {/* Timeness Control */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                Timeness:
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={timeness}
                onChange={(e) => setTimeness(parseFloat(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">
                {(timeness * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <div ref={menuRef}>
        <ModernMenu
          isOpen={isMenuOpen}
          onClose={() => setMenuOpen(false)}
          cityName={cityName}
          setCityName={setCityName}
          viewSettings={viewSettings}
          setViewSettings={setViewSettings}
          timeness={timeness}
          setTimeness={setTimeness}
          onShowComparison={() => setShowComparison(true)}
        />
      </div>

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton actions={floatingActions} />

      {/* Explanation Modal */}
      {showExplanation && (
        <ExplanationModal onClose={() => setShowExplanation(false)} />
      )}

      {/* Keyboard Shortcuts Modal */}
      {showHelp && (
        <KeyboardShortcutsModal
          isOpen={showHelp}
          shortcuts={shortcuts}
          onClose={() => setShowHelp(false)}
        />
      )}

      {/* Quick Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showComparison
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } shadow-lg`}
        >
          {showComparison ? "Single City" : "Compare Cities"}
        </button>
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 shadow-lg font-medium"
        >
          Menu
        </button>
      </div>
    </div>
  );
};

export default App;
