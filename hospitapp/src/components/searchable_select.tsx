"use client";

import { useState, useRef, useEffect } from "react";

interface SearchableSelectProps {
  options: Array<{ _id: string; name: string }>;
  placeholder: string;
  name: string;
  maxSelections?: number;
}

export function SearchableSelect({
  options,
  placeholder,
  name,
  maxSelections,
}: SearchableSelectProps) {
  const [_SEARCH_TERM, setSearchTerm] = useState("");
  const [_IS_OPEN, setIsOpen] = useState(false);
  const [_SELECTED_OPTIONS, setSelectedOptions] = useState<string[]>([]);
  const _WRAPPER_REF = useRef<HTMLDivElement>(null);

  const _FILTERED_OPTIONS = options.filter((option) =>
    option.name.toLowerCase().includes(_SEARCH_TERM.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        _WRAPPER_REF.current &&
        !_WRAPPER_REF.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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

  return (
    <div className="relative" ref={_WRAPPER_REF}>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white shadow-sm focus-within:border-blue-500 transition-colors">
        {_SELECTED_OPTIONS.map((name) => (
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
          value={_SEARCH_TERM}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          aria-haspopup="listbox"
        />
      </div>

      {_IS_OPEN && (
        <div
          className="absolute z-10 w-full mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-34 overflow-y-auto"
          role="listbox"
        >
          {_FILTERED_OPTIONS.length === 0 ? (
            <div className="p-3 text-gray-500">
              No se encontraron coincidencias
            </div>
          ) : (
            _FILTERED_OPTIONS.map((option) => (
              <label
                key={option._id}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                role="option"
              >
                <input
                  type="checkbox"
                  checked={_SELECTED_OPTIONS.includes(option.name)}
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
        value={JSON.stringify(_SELECTED_OPTIONS)}
      />
    </div>
  );
}
