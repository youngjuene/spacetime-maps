import React, { forwardRef, useEffect, useState } from "react";
import { HamburgerMenuIcon } from "./HamburgerMenuIcon";
import { CITIES } from "../cityData";
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
  isMenuOpen: boolean;
  setMenuOpen: (isMenuOpen: boolean) => void;
  cityName: string;
  setCityName: (cityName: string) => void;
  viewSettings: ViewSettings;
  setViewSettings: (viewSettings: ViewSettings) => void;
  onShowKeyboardHelp?: () => void;
  onShowMultiCity?: () => void;
};

export const ModernMenu = forwardRef<HTMLDivElement, ModernMenuProps>(
  (
    {
      timeness,
      setTimeness,
      isMenuOpen,
      setMenuOpen,
      cityName,
      setCityName,
      viewSettings,
      setViewSettings,
      onShowKeyboardHelp,
      onShowMultiCity,
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = useState(false);

    // Enhanced animation controls
    const { animationState, controls } = useAnimationControls({
      onTimeChange: setTimeness,
    });

    // Reset timeness when city changes
    useEffect(() => {
      setTimeness(0);
    }, [cityName, setTimeness]);

    // Prepare city options for dropdown
    const cityOptions: DropdownOption[] = Object.entries(CITIES).map(
      ([key, city]) => ({
        value: key,
        label: city.displayName,
        description: `Travel mode: ${city.mode}`,
        selected: key === cityName,
      })
    );

    const handleMenuToggle = () => {
      setIsAnimating(true);
      setMenuOpen(!isMenuOpen);
      setTimeout(() => setIsAnimating(false), 300);
    };

    return (
      <div
        className={cn(
          "w-full md:w-96 md:h-full",
          "fixed bottom-0 px-4 py-3",
          "md:bottom-auto md:top-0 md:right-0",
          "bg-gradient-to-br from-neutral-800 to-neutral-900 text-white",
          "shadow-2xl border-l border-neutral-700",
          "transition-all duration-300 ease-in-out",
          "touch-pan-y", // Allow vertical scrolling on mobile
          isMenuOpen
            ? "translate-y-0"
            : "translate-y-[calc(100%-4rem)] md:translate-y-0",
          isAnimating && "transition-transform duration-300"
        )}
        ref={ref}
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
            "overscroll-contain", // Prevent scroll chaining on mobile
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-6">
            {/* About Section */}
            <Card
              variant="outlined"
              className="bg-neutral-700/50 border-neutral-600"
            >
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  About Spacetime Maps
                </CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-300 space-y-3">
                <ExplanationText />
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
                  {onShowKeyboardHelp && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShowKeyboardHelp}
                      className="w-full text-white border-neutral-500 hover:bg-neutral-600"
                    >
                      ⌨️ Keyboard Shortcuts
                    </Button>
                  )}
                  {onShowMultiCity && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShowMultiCity}
                      className="w-full text-white border-neutral-500 hover:bg-neutral-600"
                    >
                      🗺️ Multi-City Comparison
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* City Selection */}
            <Card
              variant="outlined"
              className="bg-neutral-700/50 border-neutral-600"
            >
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Select City
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dropdown
                  options={cityOptions}
                  value={cityName}
                  placeholder="Choose a city..."
                  onSelect={setCityName}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Animation Controls */}
            <AnimationControlsPanel
              animationState={animationState}
              controls={controls}
              compact={false}
            />

            {/* View Settings */}
            <Card
              variant="outlined"
              className="bg-neutral-700/50 border-neutral-600"
            >
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  View Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModernViewSettingsPanel
                  viewSettings={viewSettings}
                  setViewSettings={setViewSettings}
                />
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-neutral-400 pt-4 border-t border-neutral-700">
              <p>
                Created by{" "}
                <a
                  href="https://vvolhejn.github.io/"
                  className="text-primary-400 hover:text-primary-300 underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Václav Volhejn
                </a>
              </p>
              <p className="mt-1">Map data ©Google</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
