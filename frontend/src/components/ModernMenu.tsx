import React, { useEffect, useState } from "react";
import { HamburgerMenuIcon } from "./HamburgerMenuIcon";
import { CITIES, CityName, getAllSoftMobilityModes } from "../cityData";
import { ModernViewSettingsPanel } from "./ModernViewSettingsPanel";
import { AnimationControlsPanel } from "./AnimationControlsPanel";
import { useAnimationControls } from "../hooks/useAnimationControls";
import { ViewSettings } from "../viewSettings";
import { ExplanationText } from "./ExplanationText";
import {
  Dropdown,
  DropdownOption,
  SpaceTimeProgressBar,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "./ui";
import { cn } from "../utils/cn";

export type ModernMenuProps = {
  timeness: number;
  setTimeness: (timeness: number) => void;
  isOpen: boolean;
  onClose: () => void;
  cityName: CityName;
  setCityName: (cityName: CityName) => void;
  viewSettings: ViewSettings;
  setViewSettings: (viewSettings: ViewSettings) => void;
  onShowComparison?: () => void;
};

export const ModernMenu: React.FC<ModernMenuProps> = ({
  timeness,
  setTimeness,
  isOpen,
  onClose,
  cityName,
  setCityName,
  viewSettings,
  setViewSettings,
  onShowComparison,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Enhanced animation controls for soft mobility
  const { animationState, controls } = useAnimationControls({
    onTimeChange: setTimeness,
  });

  // Reset timeness when city changes
  useEffect(() => {
    setTimeness(0);
  }, [cityName, setTimeness]);

  // Prepare city options grouped by mobility mode
  const cityOptions: DropdownOption[] = Object.entries(CITIES).map(
    ([key, city]) => ({
      value: key,
      label: `${city.displayName} (${city.mode})`,
      description: `${city.country} • ${city.avgSpeed.kmh} km/h • ${city.description}`,
      selected: key === cityName,
    })
  );

  // Group cities by mode for better organization
  const citiesByMode = getAllSoftMobilityModes().reduce(
    (acc, mode) => {
      acc[mode] = Object.entries(CITIES)
        .filter(([_, city]) => city.mode === mode)
        .map(([key, city]) => ({
          value: key,
          label: city.displayName,
          description: `${city.country} • ${city.avgSpeed.kmh} km/h`,
          selected: key === cityName,
        }));
      return acc;
    },
    {} as Record<string, DropdownOption[]>
  );

  const handleMenuToggle = () => {
    setIsAnimating(true);
    if (isOpen) {
      onClose();
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentCity = CITIES[cityName];

  return (
    <div
      className={cn(
        "w-full md:w-96 md:h-full",
        "fixed bottom-0 px-4 py-3",
        "md:bottom-auto md:top-0 md:right-0",
        "bg-gradient-to-br from-neutral-800 to-neutral-900 text-white",
        "shadow-2xl border-l border-neutral-700",
        "transition-all duration-300 ease-in-out",
        "touch-pan-y z-50",
        isOpen
          ? "translate-y-0"
          : "translate-y-[calc(100%-4rem)] md:translate-y-0",
        isAnimating && "transition-transform duration-300"
      )}
    >
      {/* Always visible header */}
      <div className="flex justify-between items-center gap-4 h-16">
        <div className="flex-1">
          <SpaceTimeProgressBar
            timeness={timeness}
            interactive={!viewSettings.animate}
            onChange={setTimeness}
            className="h-full"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuToggle}
          className="text-white hover:bg-neutral-700 p-2"
        >
          <HamburgerMenuIcon />
        </Button>
      </div>

      {/* Expandable content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          "overscroll-contain",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="py-4 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* About Soft Mobility Section */}
          <Card
            variant="outlined"
            className="bg-neutral-700/50 border-neutral-600"
          >
            <CardHeader>
              <CardTitle className="text-white text-lg">
                🚶🏃🚴 Soft Mobility Maps
              </CardTitle>
            </CardHeader>
            <CardContent className="text-neutral-300 space-y-3">
              <p className="text-sm">
                Explore how cities transform for pedestrians, runners, and
                cyclists. Compare urban mobility patterns between New York and
                Daejeon.
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/watch?v=rC2VQ-oyDG0",
                      "_blank"
                    )
                  }
                  className="w-full text-white border-neutral-500 hover:bg-neutral-600"
                >
                  📺 Watch Explanation Video
                </Button>
                {onShowComparison && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShowComparison}
                    className="w-full text-white border-neutral-500 hover:bg-neutral-600"
                  >
                    🗺️ Compare NY vs Daejeon
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current City Info */}
          {currentCity && (
            <Card
              variant="outlined"
              className="bg-neutral-700/50 border-neutral-600"
            >
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Current Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{currentCity.displayName}</span>
                  <span className="text-xs bg-neutral-600 px-2 py-1 rounded capitalize">
                    {currentCity.mode}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p>🌍 {currentCity.country}</p>
                  <p>⚡ {currentCity.avgSpeed.kmh} km/h average</p>
                  <p>👥 {currentCity.population.toLocaleString()} people</p>
                  {currentCity.walkabilityScore && (
                    <p>🚶 {currentCity.walkabilityScore}/100 walkability</p>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-2">
                  {currentCity.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* City Selection by Mode */}
          <Card
            variant="outlined"
            className="bg-neutral-700/50 border-neutral-600"
          >
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Select City & Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getAllSoftMobilityModes().map((mode) => (
                <div key={mode} className="space-y-2">
                  <h4 className="text-sm font-medium text-neutral-300 capitalize flex items-center gap-2">
                    {mode === "pedestrian" && "🚶"}
                    {mode === "runner" && "🏃"}
                    {mode === "cyclist" && "🚴"}
                    {mode}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {citiesByMode[mode]?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setCityName(option.value as CityName)}
                        className={cn(
                          "text-left p-3 rounded-lg border transition-colors",
                          option.selected
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-neutral-600 border-neutral-500 text-neutral-200 hover:bg-neutral-500"
                        )}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs opacity-75">
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Animation Controls */}
          <AnimationControlsPanel
            animationState={animationState}
            controls={controls}
            compact={false}
            className="bg-neutral-700/50 border-neutral-600"
          />

          {/* View Settings */}
          <ModernViewSettingsPanel
            viewSettings={viewSettings}
            setViewSettings={setViewSettings}
          />

          {/* Soft Mobility Tips */}
          <Card
            variant="outlined"
            className="bg-neutral-700/50 border-neutral-600"
          >
            <CardHeader>
              <CardTitle className="text-white text-lg">
                💡 Mobility Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-neutral-300 space-y-2 text-sm">
              <p>
                • <strong>Pedestrian:</strong> Focus on walkability and urban
                density
              </p>
              <p>
                • <strong>Runner:</strong> Observe route efficiency and pace
                zones
              </p>
              <p>
                • <strong>Cyclist:</strong> Notice infrastructure impact on
                speed
              </p>
              <p>
                • Use the timeness slider to see how distance transforms over
                time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
