import React from "react";
import {
  AnimationState,
  AnimationControls,
} from "../hooks/useAnimationControls";
import {
  Button,
  Slider,
  Toggle,
  Dropdown,
  DropdownOption,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui";
import { cn } from "../utils/cn";

export interface AnimationControlsPanelProps {
  animationState: AnimationState;
  controls: AnimationControls;
  className?: string;
  compact?: boolean;
}

export const AnimationControlsPanel: React.FC<AnimationControlsPanelProps> = ({
  animationState,
  controls,
  className,
  compact = false,
}) => {
  const directionOptions: DropdownOption[] = [
    { value: "forward", label: "Forward", description: "Space → Time" },
    { value: "reverse", label: "Reverse", description: "Time → Space" },
    { value: "pingpong", label: "Ping-Pong", description: "Back and forth" },
  ];

  const speedPresets = [
    { label: "0.25x", value: 0.25 },
    { label: "0.5x", value: 0.5 },
    { label: "1x", value: 1.0 },
    { label: "1.5x", value: 1.5 },
    { label: "2x", value: 2.0 },
    { label: "3x", value: 3.0 },
  ];

  const formatTime = (time: number) => {
    const percentage = Math.round(time * 100);
    return `${percentage}%`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed}x`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {/* Play/Pause Button */}
        <Button
          variant={animationState.isPlaying ? "secondary" : "primary"}
          size="sm"
          onClick={animationState.isPlaying ? controls.pause : controls.play}
          className="w-10 h-10 p-0"
        >
          {animationState.isPlaying ? "⏸️" : "▶️"}
        </Button>

        {/* Timeline Scrubber */}
        <div className="flex-1 min-w-0">
          <Slider
            value={animationState.currentTime * 100}
            onChange={(value) => controls.scrubTo(value / 100)}
            min={0}
            max={100}
            step={1}
            showValue
            formatValue={formatTime}
            className="text-white"
          />
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-1">
          {speedPresets.map((preset) => (
            <Button
              key={preset.value}
              variant={
                Math.abs(animationState.speed - preset.value) < 0.01
                  ? "primary"
                  : "ghost"
              }
              size="sm"
              onClick={() => controls.setSpeed(preset.value)}
              className="text-xs px-2 py-1 h-auto"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card
      variant="outlined"
      className={cn("bg-neutral-700/50 border-neutral-600", className)}
    >
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          🎬 Animation Controls
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Playback Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
            Playback
          </h4>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={controls.stepBackward}
              className="text-white border-neutral-500 hover:bg-neutral-600"
            >
              ⏮️
            </Button>

            <Button
              variant={animationState.isPlaying ? "secondary" : "primary"}
              size="sm"
              onClick={
                animationState.isPlaying ? controls.pause : controls.play
              }
              className="px-4"
            >
              {animationState.isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={controls.stepForward}
              className="text-white border-neutral-500 hover:bg-neutral-600"
            >
              ⏭️
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={controls.stop}
              className="text-white border-neutral-500 hover:bg-neutral-600"
            >
              ⏹️ Stop
            </Button>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
            Timeline
          </h4>

          <Slider
            value={animationState.currentTime * 100}
            onChange={(value) => controls.scrubTo(value / 100)}
            min={0}
            max={100}
            step={1}
            label="Position"
            showValue
            formatValue={formatTime}
            className="text-neutral-300"
          />
        </div>

        {/* Speed Control */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
            Speed
          </h4>

          <div className="space-y-2">
            <Slider
              value={animationState.speed * 100}
              onChange={(value) => controls.setSpeed(value / 100)}
              min={10}
              max={300}
              step={5}
              label="Animation Speed"
              showValue
              formatValue={(val) => formatSpeed(val / 100)}
              className="text-neutral-300"
            />

            <div className="flex flex-wrap gap-1">
              {speedPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    Math.abs(animationState.speed - preset.value) < 0.01
                      ? "primary"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() => controls.setSpeed(preset.value)}
                  className="text-xs px-2 py-1 h-auto text-white"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Direction Control */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
            Direction
          </h4>

          <Dropdown
            options={directionOptions}
            value={animationState.direction}
            onSelect={(value) =>
              controls.setDirection(value as AnimationState["direction"])
            }
            className="w-full"
          />
        </div>

        {/* Loop Control */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
            Options
          </h4>

          <Toggle
            checked={animationState.loop}
            onChange={controls.setLoop}
            label="Loop animation"
            description="Restart animation when it reaches the end"
          />
        </div>

        {/* Status Display */}
        <div className="pt-4 border-t border-neutral-600">
          <div className="text-xs text-neutral-400 space-y-1">
            <p>
              <strong>Status:</strong>{" "}
              {animationState.isPlaying ? "Playing" : "Paused"} |
              <strong> Position:</strong>{" "}
              {formatTime(animationState.currentTime)} |<strong> Speed:</strong>{" "}
              {formatSpeed(animationState.speed)}
            </p>
            <p>
              <strong>Direction:</strong> {animationState.direction} |
              <strong> Loop:</strong> {animationState.loop ? "On" : "Off"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
