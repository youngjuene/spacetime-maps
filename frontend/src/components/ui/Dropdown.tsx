import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  selected?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = "Select an option",
  onSelect,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-left",
          "bg-white border border-neutral-300 rounded-lg shadow-sm",
          "hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "transition-all duration-200",
          disabled && "opacity-50 cursor-not-allowed bg-neutral-50",
          isOpen && "ring-2 ring-primary-500 border-transparent"
        )}
        disabled={disabled}
      >
        <div className="flex flex-col">
          <span className="text-neutral-900 font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.description && (
            <span className="text-sm text-neutral-500 mt-0.5">
              {selectedOption.description}
            </span>
          )}
        </div>

        <svg
          className={cn(
            "w-5 h-5 text-neutral-400 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg animate-slide-up">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors duration-150",
                  "focus:outline-none focus:bg-neutral-50",
                  option.selected && "bg-primary-50 text-primary-700"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-neutral-900">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-sm text-neutral-500 mt-0.5">
                      {option.description}
                    </span>
                  )}
                </div>
                {option.selected && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
