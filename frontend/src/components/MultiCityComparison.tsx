import React from "react";
import { Container, Stage, Text } from "@pixi/react";
import { SpacetimeMap } from "./SpacetimeMap";
import { ViewSettings } from "../viewSettings";
import {
  useMultiCityComparison,
  CitySlot,
} from "../hooks/useMultiCityComparison";
import {
  Button,
  Dropdown,
  DropdownOption,
  Toggle,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LoadingSpinner,
} from "./ui";
import { CITIES } from "../cityData";
import { cn } from "../utils/cn";

export interface MultiCityComparisonProps {
  viewSettings: ViewSettings;
  timeness: number;
  onTick: (deltaSeconds: number) => void;
  mapSizePx: number;
  className?: string;
}

const CityMapSlot: React.FC<{
  slot: CitySlot;
  viewSettings: ViewSettings;
  timeness: number;
  onTick: (deltaSeconds: number) => void;
  mapSizePx: number;
  showLabel: boolean;
  onRemove: () => void;
  onUpdateCity: (cityName: string) => void;
  availableCities: string[];
}> = ({
  slot,
  viewSettings,
  timeness,
  onTick,
  mapSizePx,
  showLabel,
  onRemove,
  onUpdateCity,
  availableCities,
}) => {
  const cityOptions: DropdownOption[] = [
    ...(slot.cityName
      ? [
          {
            value: slot.cityName,
            label: CITIES[slot.cityName]?.displayName || slot.cityName,
            description: `Current: ${CITIES[slot.cityName]?.mode || "Unknown"}`,
            selected: true,
          },
        ]
      : []),
    ...availableCities.map((cityName) => ({
      value: cityName,
      label: CITIES[cityName].displayName,
      description: `Travel mode: ${CITIES[cityName].mode}`,
    })),
  ];

  return (
    <div className="relative bg-neutral-800 rounded-lg overflow-hidden border border-neutral-600">
      {/* Header */}
      {showLabel && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Dropdown
                options={cityOptions}
                value={slot.cityName || ""}
                placeholder="Select city..."
                onSelect={onUpdateCity}
                className="min-w-0 flex-1"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="ml-2 px-2 py-1 h-auto text-xs"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Map Content */}
      <div className="relative">
        <Stage
          width={mapSizePx}
          height={mapSizePx}
          options={{
            autoDensity: true,
            backgroundColor: 0xf8fafc,
          }}
        >
          {slot.isLoading && (
            <Container>
              <Text
                text="Loading..."
                anchor={0.5}
                x={mapSizePx / 2}
                y={mapSizePx / 2}
              />
            </Container>
          )}

          {slot.error && (
            <Container>
              <Text
                text={`Error: ${slot.error}`}
                anchor={0.5}
                x={mapSizePx / 2}
                y={mapSizePx / 2}
                style={{ fill: 0xff0000, fontSize: 12 } as any}
              />
            </Container>
          )}

          {slot.city && !slot.isLoading && !slot.error && (
            <SpacetimeMap
              viewSettings={viewSettings}
              hoveredPoint={null}
              timeness={timeness}
              city={slot.city}
              onTick={onTick}
            />
          )}
        </Stage>

        {/* Loading Overlay */}
        {slot.isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>

      {/* Footer Label */}
      {showLabel && slot.city && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div className="text-white text-sm font-medium text-center">
            {slot.city.displayName}
            <span className="text-neutral-300 text-xs block">
              {slot.city.mode} mode
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export const MultiCityComparison: React.FC<MultiCityComparisonProps> = ({
  viewSettings,
  timeness,
  onTick,
  mapSizePx,
  className,
}) => {
  const {
    state,
    controls,
    getAvailableCities,
    getLoadedCities,
    isMaxCapacityReached,
  } = useMultiCityComparison();

  const layoutOptions: DropdownOption[] = [
    {
      value: "grid",
      label: "Grid Layout",
      description: "2x2 grid arrangement",
    },
    { value: "horizontal", label: "Horizontal", description: "Side by side" },
    { value: "vertical", label: "Vertical", description: "Stacked vertically" },
  ];

  const availableCities = getAvailableCities();
  const loadedCities = getLoadedCities();

  const getGridClasses = () => {
    const count = state.slots.length;
    if (state.layout === "horizontal") {
      return `grid grid-cols-${Math.min(count, 4)} gap-4`;
    } else if (state.layout === "vertical") {
      return "grid grid-cols-1 gap-4";
    } else {
      // Grid layout
      if (count <= 1) return "grid grid-cols-1 gap-4";
      if (count <= 2) return "grid grid-cols-2 gap-4";
      return "grid grid-cols-2 gap-4";
    }
  };

  const getMapSize = () => {
    const count = state.slots.length;
    if (state.layout === "horizontal" && count > 2) {
      return Math.floor(mapSizePx / 2);
    } else if (state.layout === "grid" && count > 1) {
      return Math.floor(mapSizePx / 2);
    }
    return mapSizePx;
  };

  if (state.slots.length === 0) {
    return (
      <Card className={cn("bg-neutral-800 border-neutral-600", className)}>
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-2">
            🗺️ Multi-City Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="text-neutral-400">
              <p className="text-lg mb-2">
                Compare multiple cities side by side
              </p>
              <p className="text-sm">
                Add cities to see how spacetime maps differ across locations
              </p>
            </div>

            {availableCities.length > 0 && (
              <Button
                variant="primary"
                onClick={() => controls.addCity(availableCities[0])}
                className="mx-auto"
              >
                + Add First City
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <Card className="bg-neutral-800 border-neutral-600">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-2">
            🗺️ Multi-City Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Add City */}
            {!isMaxCapacityReached && availableCities.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-300 text-sm">Add city:</span>
                <Dropdown
                  options={availableCities.map((cityName) => ({
                    value: cityName,
                    label: CITIES[cityName].displayName,
                    description: `Travel mode: ${CITIES[cityName].mode}`,
                  }))}
                  placeholder="Select city..."
                  onSelect={controls.addCity}
                  className="w-48"
                />
              </div>
            )}

            {/* Layout Control */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-300 text-sm">Layout:</span>
              <Dropdown
                options={layoutOptions}
                value={state.layout}
                onSelect={(value) => controls.setLayout(value as any)}
                className="w-40"
              />
            </div>

            {/* Options */}
            <div className="flex items-center gap-4">
              <Toggle
                checked={state.syncAnimation}
                onChange={controls.setSyncAnimation}
                label="Sync animation"
                size="sm"
              />

              <Toggle
                checked={state.showLabels}
                onChange={controls.setShowLabels}
                label="Show labels"
                size="sm"
              />
            </div>

            {/* Clear All */}
            {state.slots.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={controls.clearAll}
                className="ml-auto"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Status */}
          <div className="text-xs text-neutral-400">
            <p>
              {loadedCities.length} of {state.slots.length} cities loaded
              {isMaxCapacityReached && " (Maximum reached)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* City Maps Grid */}
      <div className={getGridClasses()}>
        {state.slots.map((slot) => (
          <CityMapSlot
            key={slot.id}
            slot={slot}
            viewSettings={viewSettings}
            timeness={state.syncAnimation ? timeness : 0}
            onTick={onTick}
            mapSizePx={getMapSize()}
            showLabel={state.showLabels}
            onRemove={() => controls.removeCity(slot.id)}
            onUpdateCity={(cityName) => controls.updateCity(slot.id, cityName)}
            availableCities={availableCities}
          />
        ))}
      </div>
    </div>
  );
};
