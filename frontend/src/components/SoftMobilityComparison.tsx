import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { SpacetimeMap } from "./SpacetimeMap";
import {
  CityName,
  City,
  SoftMobilityMode,
  fetchCity,
  getSoftMobilityComparisonPairs,
  getMobilityEfficiencyComparison,
  getSoftMobilityInsights,
  getAllSoftMobilityModes,
} from "../cityData";
import { useMapSizePx } from "../useIsMobile";
import { ViewSettings } from "../viewSettings";

interface SoftMobilityComparisonProps {
  viewSettings: ViewSettings;
  timeness: number;
  onCitySelect?: (cityName: CityName) => void;
}

interface ComparisonData {
  newYork: City | null;
  daejeon: City | null;
  mode: SoftMobilityMode;
  loading: boolean;
  error: string | null;
}

export const SoftMobilityComparison: React.FC<SoftMobilityComparisonProps> = ({
  viewSettings,
  timeness,
  onCitySelect,
}) => {
  const [selectedMode, setSelectedMode] =
    useState<SoftMobilityMode>("pedestrian");
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    newYork: null,
    daejeon: null,
    mode: "pedestrian",
    loading: true,
    error: null,
  });
  const [showInsights, setShowInsights] = useState(true);

  const mapSizePx = useMapSizePx();
  const comparisonPairs = getSoftMobilityComparisonPairs();

  // Load cities for the selected mobility mode
  useEffect(() => {
    const loadCities = async () => {
      setComparisonData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const pair = comparisonPairs.find((p) => p.mode === selectedMode);
        if (!pair) {
          throw new Error(`No comparison pair found for ${selectedMode}`);
        }

        const [newYorkCity, daejeonCity] = await Promise.all([
          fetchCity(pair.newYork),
          fetchCity(pair.daejeon),
        ]);

        setComparisonData({
          newYork: newYorkCity,
          daejeon: daejeonCity,
          mode: selectedMode,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Failed to load comparison data:", error);
        setComparisonData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    loadCities();
  }, [selectedMode]);

  // Calculate efficiency comparison
  const efficiencyComparison = useMemo(() => {
    if (!comparisonData.newYork || !comparisonData.daejeon) return null;

    const pair = comparisonPairs.find((p) => p.mode === selectedMode);
    if (!pair) return null;

    return getMobilityEfficiencyComparison(pair.newYork);
  }, [comparisonData, selectedMode]);

  // Get insights for both cities
  const insights = useMemo(() => {
    if (!comparisonData.newYork || !comparisonData.daejeon) return null;

    const pair = comparisonPairs.find((p) => p.mode === selectedMode);
    if (!pair) return null;

    return {
      newYork: getSoftMobilityInsights(pair.newYork),
      daejeon: getSoftMobilityInsights(pair.daejeon),
    };
  }, [comparisonData, selectedMode]);

  const handleModeChange = (mode: SoftMobilityMode) => {
    setSelectedMode(mode);
  };

  const handleCityClick = (cityName: CityName) => {
    onCitySelect?.(cityName);
  };

  if (comparisonData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading soft mobility data...</p>
        </div>
      </div>
    );
  }

  if (comparisonData.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
        <p className="text-red-600">{comparisonData.error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with Mode Selection */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Soft Mobility Comparison: New York vs Daejeon
          </h2>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showInsights ? "Hide" : "Show"} Insights
          </button>
        </div>

        {/* Mobility Mode Selector */}
        <div className="flex space-x-2">
          {getAllSoftMobilityModes().map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMode === mode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison View */}
      <div className="flex-1 flex">
        {/* Maps Side by Side */}
        <div className="flex-1 flex">
          {/* New York Map */}
          <div className="flex-1 relative border-r border-gray-200">
            <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
              <h3 className="font-bold text-lg text-blue-600">New York City</h3>
              <p className="text-sm text-gray-600 capitalize">
                {selectedMode} Mode
              </p>
              {comparisonData.newYork && (
                <div className="mt-2 text-xs">
                  <p>Speed: {comparisonData.newYork.avgSpeed.kmh} km/h</p>
                  <p>
                    Efficiency:{" "}
                    {(comparisonData.newYork.maxTimeness * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
            {comparisonData.newYork && (
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ width: "100%", height: "100%" }}
                onClick={() => {
                  const pair = comparisonPairs.find(
                    (p) => p.mode === selectedMode
                  );
                  if (pair) handleCityClick(pair.newYork);
                }}
              >
                <SpacetimeMap
                  city={comparisonData.newYork}
                  timeness={timeness}
                  viewSettings={viewSettings}
                  hoveredPoint={null}
                  onTick={() => {}}
                />
              </Canvas>
            )}
          </div>

          {/* Daejeon Map */}
          <div className="flex-1 relative">
            <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
              <h3 className="font-bold text-lg text-green-600">Daejeon</h3>
              <p className="text-sm text-gray-600 capitalize">
                {selectedMode} Mode
              </p>
              {comparisonData.daejeon && (
                <div className="mt-2 text-xs">
                  <p>Speed: {comparisonData.daejeon.avgSpeed.kmh} km/h</p>
                  <p>
                    Efficiency:{" "}
                    {(comparisonData.daejeon.maxTimeness * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
            {comparisonData.daejeon && (
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ width: "100%", height: "100%" }}
                onClick={() => {
                  const pair = comparisonPairs.find(
                    (p) => p.mode === selectedMode
                  );
                  if (pair) handleCityClick(pair.daejeon);
                }}
              >
                <SpacetimeMap
                  city={comparisonData.daejeon}
                  timeness={timeness}
                  viewSettings={viewSettings}
                  hoveredPoint={null}
                  onTick={() => {}}
                />
              </Canvas>
            )}
          </div>
        </div>

        {/* Insights Panel */}
        {showInsights && insights && efficiencyComparison && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Mobility Insights</h3>

            {/* Efficiency Comparison */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2 text-blue-600">
                Efficiency Analysis
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Faster City:</span>{" "}
                  <span className="capitalize">
                    {String(efficiencyComparison.insights.fasterCity).includes(
                      "newyork"
                    )
                      ? "New York"
                      : "Daejeon"}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Speed Difference:</span>{" "}
                  {efficiencyComparison.insights.speedDifference.toFixed(1)}{" "}
                  km/h
                </p>
                {efficiencyComparison.insights.walkabilityDifference > 0 && (
                  <p>
                    <span className="font-medium">Walkability Gap:</span>{" "}
                    {efficiencyComparison.insights.walkabilityDifference} points
                  </p>
                )}
              </div>
            </div>

            {/* New York Insights */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-700">New York</h4>
              <div className="space-y-1 text-sm">
                {insights.newYork.walkability && (
                  <p>Walkability: {insights.newYork.walkability}/100</p>
                )}
                <p>Infrastructure: {insights.newYork.infrastructure}</p>
                <div className="mt-2">
                  <p className="font-medium text-xs text-blue-600 mb-1">
                    Recommendations:
                  </p>
                  {insights.newYork.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-xs text-gray-600">
                      • {rec}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Daejeon Insights */}
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-700">Daejeon</h4>
              <div className="space-y-1 text-sm">
                {insights.daejeon.walkability && (
                  <p>Walkability: {insights.daejeon.walkability}/100</p>
                )}
                <p>Infrastructure: {insights.daejeon.infrastructure}</p>
                <div className="mt-2">
                  <p className="font-medium text-xs text-green-600 mb-1">
                    Recommendations:
                  </p>
                  {insights.daejeon.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-xs text-gray-600">
                      • {rec}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Mode-specific Information */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-yellow-700 capitalize">
                {selectedMode} Mode Analysis
              </h4>
              <div className="text-sm text-gray-700">
                {selectedMode === "pedestrian" && (
                  <p>
                    Comparing walkability and pedestrian infrastructure between
                    dense urban NYC and planned Daejeon.
                  </p>
                )}
                {selectedMode === "runner" && (
                  <p>
                    Analyzing running routes, pace efficiency, and urban running
                    conditions.
                  </p>
                )}
                {selectedMode === "cyclist" && (
                  <p>
                    Evaluating cycling infrastructure, safety, and speed
                    potential in both cities.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
