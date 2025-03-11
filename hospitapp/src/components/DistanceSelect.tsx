// DistanceSelect.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface DistanceSelectProps {
  name: string;
  onChange: (value: string) => void;
  value: string;
}

export function DistanceSelect({ name, onChange, value }: DistanceSelectProps) {
  const [_IS_OPEN, setIsOpen] = useState(false);
  const [_CLICK_COUNT, setClickCount] = useState(0);
  const _WRAPPER_REF = useRef<HTMLDivElement>(null);

  const distances = [
    { value: "5000", label: "5 km" },
    { value: "10000", label: "10 km" },
    { value: "15000", label: "15 km" },
    { value: "20000", label: "20 km" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        _WRAPPER_REF.current &&
        !_WRAPPER_REF.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setClickCount(0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputClick = () => {
    setClickCount((prev) => prev + 1);
    setIsOpen(true);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setClickCount(0);
  };

  const selectedLabel = distances.find((d) => d.value === value)?.label || "Selecciona una distancia...";

  return (
    <div className="relative" ref={_WRAPPER_REF}>
      <div
        className="flex items-center p-2 border border-gray-200 rounded-lg bg-white shadow-sm focus-within:border-blue-500 transition-colors cursor-pointer"
        onClick={handleInputClick}
      >
        <span
          className={`flex-1 min-w-[150px] p-2 ${
            value ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {selectedLabel}
        </span>
      </div>

      {_IS_OPEN && (
        <div
          className="absolute z-10 w-full mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-25 overflow-y-auto overflow-x-hidden"
          role="listbox"
        >
          {distances.map((distance) => (
            <label
              key={distance.value}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
              role="option"
            >
              <input
                type="checkbox"
                checked={value === distance.value}
                onChange={() => handleSelect(distance.value)}
                className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label={`Seleccionar ${distance.label}`}
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