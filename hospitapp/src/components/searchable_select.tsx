"use client";

import { useState, useRef, useEffect } from "react";

interface SearchableSelectProps {
  options: Array<{ _id: string; name: string }>;
  placeholder: string;
  name: string;
  maxSelections?: number;
  initialValues?: string[];
}

export function SearchableSelect({
  options,
  placeholder,
  name,
  maxSelections,
  initialValues = [],
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialValues);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [clickCount, setClickCount] = useState(0);

  // Synchronize selectedOptions with initialValues when it changes
  useEffect(() => {
    setSelectedOptions(initialValues);
  }, [initialValues]);

  const filteredOptions = options.filter((option) =>
    option.name && option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setClickCount(0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (name: string) => {
    setSelectedOptions((prev) =>
      prev.includes(name)
        ? prev.filter((v) => v !== name)
        : maxSelections && prev.length >= maxSelections
        ? prev
        : [...prev, name]
    );
  };

  const handleInputClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickCount === 0) {
      setIsOpen(true);
    } else if (clickCount === 1) {
      inputRef.current?.removeAttribute("readOnly");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white shadow-sm focus-within:border-blue-500 transition-colors">
        {selectedOptions.map((name) => (
          <span
            key={name}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
          >
            {name}
            <button
              type="button"
              onClick={() => toggleOption(name)}
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label={`Remover ${name}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 min-w-[150px] p-2 border-none focus:ring-0 outline-none placeholder-gray-400 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleInputClick}
          readOnly
          ref={inputRef}
          aria-haspopup="listbox"
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-34 overflow-y-auto overflow-x-hidden"
          role="listbox"
        >
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-gray-500">
              No se encontraron coincidencias
            </div>
          ) : (
            filteredOptions.map((option) => (
              <label
                key={option._id}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                role="option"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.name)}
                  onChange={() => toggleOption(option.name)}
                  className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  aria-label={`Seleccionar ${option.name}`}
                />
                <span className="text-gray-700">{option.name}</span>
              </label>
            ))
          )}
        </div>
      )}

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(selectedOptions)}
      />
    </div>
  );
}