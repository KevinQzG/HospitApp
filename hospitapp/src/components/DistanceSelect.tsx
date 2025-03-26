"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface DistanceSelectProps {
  name: string;
  onChange: (value: string) => void;
  value: string;
}

export function DistanceSelect({ name, onChange, value }: DistanceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLabelElement | null)[]>([]);

  const distances = [
    { value: "5000", label: "5 km" },
    { value: "10000", label: "10 km" },
    { value: "15000", label: "15 km" },
    { value: "20000", label: "20 km" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else if (focusedIndex >= 0) {
        handleSelect(distances[focusedIndex].value);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else {
        setFocusedIndex((prev) => Math.min(prev + 1, distances.length - 1));
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(distances.length - 1);
      } else {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const selectedLabel = distances.find((d) => d.value === value)?.label || "Selecciona una distancia...";

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="flex items-center p-2 border border-gray-200 rounded-lg bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-all cursor-pointer"
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-label="Seleccionar distancia máxima"
      >
        <span className={`flex-1 min-w-[150px] p-2 ${value ? "text-gray-700" : "text-gray-700"}`}>
          {selectedLabel}
        </span>
      </div>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-25 overflow-y-auto overflow-x-hidden"
          role="listbox"
        >
          {distances.map((distance, index) => (
            <label
              key={distance.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer focus:bg-gray-100 outline-none"
              role="option"
              tabIndex={-1}
              aria-selected={value === distance.value}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(distance.value);
                }
              }}
            >
              <input
                type="checkbox"
                checked={value === distance.value}
                onChange={() => handleSelect(distance.value)}
                className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                tabIndex={-1}
                aria-hidden="true"
              />
              <span className="text-gray-700">{distance.label}</span>
            </label>
          ))}
        </div>
      )}

      <input type="hidden" name={name} value={value} />
    </div>
  );
}