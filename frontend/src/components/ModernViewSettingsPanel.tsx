import React from "react";
import { ViewSettings, toggleSetting } from "../viewSettings";
import { Toggle, Slider } from "./ui";

export interface ModernViewSettingsPanelProps {
  viewSettings: ViewSettings;
  setViewSettings: (viewSettings: ViewSettings) => void;
}

export const ModernViewSettingsPanel: React.FC<
  ModernViewSettingsPanelProps
> = ({ viewSettings, setViewSettings }) => {
  const toggleViewSetting = (setting: keyof ViewSettings) => {
    setViewSettings(toggleSetting(viewSettings, setting));
  };

  const updateThreshold = (value: number) => {
    setViewSettings({
      ...viewSettings,
      showSpringsThreshold: value / 100, // Convert from 0-100 to 0-1
    });
  };

  return (
    <div className="space-y-4">
      {/* Animation Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
          Animation
        </h4>
        <Toggle
          checked={viewSettings.animate}
          onChange={() => toggleViewSetting("animate")}
          label="Auto-animate"
          description="Automatically cycle between space and time views"
        />
      </div>

      {/* Interaction Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
          Interaction
        </h4>
        <Toggle
          checked={viewSettings.focusOnHover}
          onChange={() => toggleViewSetting("focusOnHover")}
          label="Focus on hover"
          description="Highlight areas when hovering over the map"
        />
      </div>

      {/* Visual Elements */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
          Visual Elements
        </h4>

        <Toggle
          checked={viewSettings.showSpringArrows}
          onChange={() => toggleViewSetting("showSpringArrows")}
          label="Show arrows"
          description="Display directional arrows on connections"
        />

        <Toggle
          checked={viewSettings.showGrid}
          onChange={() => toggleViewSetting("showGrid")}
          label="Show grid"
          description="Display the underlying grid structure"
        />

        <Toggle
          checked={viewSettings.showGridPoints}
          onChange={() => toggleViewSetting("showGridPoints")}
          label="Show grid points"
          description="Display individual grid intersection points"
        />

        <Toggle
          checked={viewSettings.showGridNumbers}
          onChange={() => toggleViewSetting("showGridNumbers")}
          label="Show grid numbers"
          description="Display numerical labels on grid points"
        />
      </div>

      {/* Advanced Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
          Advanced
        </h4>

        <Toggle
          checked={viewSettings.showSpringsByDistance}
          onChange={() => toggleViewSetting("showSpringsByDistance")}
          label="Filter by distance"
          description="Show connections based on distance threshold"
        />

        {viewSettings.showSpringsByDistance && (
          <div className="ml-6 mt-3">
            <Slider
              value={viewSettings.showSpringsThreshold * 100}
              onChange={updateThreshold}
              min={0}
              max={100}
              step={1}
              label="Distance threshold"
              showValue
              formatValue={(val) => `${val}%`}
              className="text-neutral-300"
            />
          </div>
        )}
      </div>

      {/* Performance Info */}
      <div className="pt-4 border-t border-neutral-600">
        <div className="text-xs text-neutral-400 space-y-1">
          <p>
            💡 <strong>Tip:</strong> Disable animations for better performance
            on slower devices
          </p>
          <p>
            🎯 <strong>Interactive:</strong> Click the progress bar to jump to
            any time position
          </p>
        </div>
      </div>
    </div>
  );
};
