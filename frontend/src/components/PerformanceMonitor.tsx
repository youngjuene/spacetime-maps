import React, { useState } from "react";
import {
  useThreePerformance,
  PerformanceStats,
} from "../hooks/useThreePerformance";
import { Card, CardContent, CardHeader, CardTitle } from "./ui";

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  compact?: boolean;
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true,
  position = "top-right",
  compact = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const { stats, qualityLevel, isPerformanceGood } = useThreePerformance();

  if (!enabled) return null;

  const getPositionClasses = () => {
    const baseClasses = "fixed z-50";
    switch (position) {
      case "top-left":
        return `${baseClasses} top-4 left-4`;
      case "top-right":
        return `${baseClasses} top-4 right-4`;
      case "bottom-left":
        return `${baseClasses} bottom-4 left-4`;
      case "bottom-right":
        return `${baseClasses} bottom-4 right-4`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return "text-green-500";
    if (fps >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "high":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-red-500";
      default:
        return "text-neutral-500";
    }
  };

  const formatMemory = (bytes: number) => {
    return `${bytes.toFixed(1)} MB`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (compact && !isExpanded) {
    return (
      <div className={`${getPositionClasses()} ${className}`}>
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono hover:bg-black/90 transition-colors"
        >
          <span className={getFPSColor(stats.fps)}>{stats.fps} FPS</span>
          {!isPerformanceGood && <span className="ml-2 text-red-400">⚠️</span>}
        </button>
      </div>
    );
  }

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      <Card className="bg-black/90 border-neutral-700 text-white min-w-[280px]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Performance Monitor
            </CardTitle>
            {compact && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm font-mono">
          {/* FPS and Frame Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-neutral-400 text-xs">FPS</div>
              <div className={`text-lg font-bold ${getFPSColor(stats.fps)}`}>
                {stats.fps}
              </div>
            </div>
            <div>
              <div className="text-neutral-400 text-xs">Frame Time</div>
              <div className="text-white">{stats.frameTime.toFixed(1)}ms</div>
            </div>
          </div>

          {/* Quality Level */}
          <div>
            <div className="text-neutral-400 text-xs">Quality Level</div>
            <div className={`font-semibold ${getQualityColor(qualityLevel)}`}>
              {qualityLevel.toUpperCase()}
              {!isPerformanceGood && (
                <span className="ml-2 text-red-400">⚠️ Low Performance</span>
              )}
            </div>
          </div>

          {/* Memory Usage */}
          <div>
            <div className="text-neutral-400 text-xs">Memory Usage</div>
            <div className="text-white">{formatMemory(stats.memory)}</div>
          </div>

          {/* Render Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-neutral-400 text-xs">Draw Calls</div>
              <div className="text-white">{formatNumber(stats.drawCalls)}</div>
            </div>
            <div>
              <div className="text-neutral-400 text-xs">Triangles</div>
              <div className="text-white">{formatNumber(stats.triangles)}</div>
            </div>
          </div>

          {/* Resource Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-neutral-400 text-xs">Geometries</div>
              <div className="text-white">{stats.geometries}</div>
            </div>
            <div>
              <div className="text-neutral-400 text-xs">Textures</div>
              <div className="text-white">{stats.textures}</div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="pt-2 border-t border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-xs">Status</span>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPerformanceGood ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={
                    isPerformanceGood ? "text-green-400" : "text-red-400"
                  }
                >
                  {isPerformanceGood ? "Good" : "Poor"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
