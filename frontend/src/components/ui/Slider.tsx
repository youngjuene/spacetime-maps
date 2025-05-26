import React, { useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
  formatValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  className,
  formatValue = (val) => val.toString(),
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const newPercentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = min + (newPercentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onChange(clampedValue);
  }, [min, max, step, onChange, disabled]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(event.clientX);
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDragging) {
      updateValue(event.clientX);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className="text-sm font-medium text-neutral-700">{label}</label>
          )}
          {showValue && (
            <span className="text-sm text-neutral-500">{formatValue(value)}</span>
          )}
        </div>
      )}
      
      <div
        ref={sliderRef}
        className={cn(
          'relative h-6 flex items-center cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Track */}
        <div className="w-full h-2 bg-neutral-200 rounded-full">
          {/* Progress */}
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Thumb */}
        <div
          className={cn(
            'absolute w-5 h-5 bg-white border-2 border-primary-500 rounded-full shadow-md',
            'transform -translate-x-1/2 transition-all duration-150',
            'hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            isDragging && 'scale-110 ring-2 ring-primary-500 ring-offset-2',
            disabled && 'border-neutral-300'
          )}
          style={{ left: `${percentage}%` }}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={(e) => {
            if (disabled) return;
            let newValue = value;
            switch (e.key) {
              case 'ArrowLeft':
              case 'ArrowDown':
                newValue = Math.max(min, value - step);
                break;
              case 'ArrowRight':
              case 'ArrowUp':
                newValue = Math.min(max, value + step);
                break;
              case 'Home':
                newValue = min;
                break;
              case 'End':
                newValue = max;
                break;
              default:
                return;
            }
            e.preventDefault();
            onChange(newValue);
          }}
        />
      </div>
    </div>
  );
}; 