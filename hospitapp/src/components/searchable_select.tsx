"use client";

import { useState, useRef, useEffect } from "react";

interface SearchableSelectProps {
  options: Array<{ _id: string; name: string; displayName?: string }>;
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
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(initialValues);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar selectedOptions con initialValues cuando cambie
  useEffect(() => {
    setSelectedOptions(initialValues);
  }, [initialValues]);

  // Filtrar opciones basadas en el término de búsqueda
  const filteredOptions = options.filter(
    (option) =>
      option.name &&
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsSearching(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Alternar selección de una opción
  const toggleOption = (name: string) => {
    setSelectedOptions((prev) =>
      prev.includes(name)
        ? prev.filter((v) => v !== name)
        : maxSelections && prev.length >= maxSelections
        ? prev
        : [...prev, name]
    );
  };

  // Manejar clics en el input
  const handleInputClick = () => {
    setIsOpen(true);
    // No enfocamos el input inmediatamente para evitar que aparezca el teclado
  };

  // Manejar doble clic o clic en el icono de búsqueda
  const handleSearchClick = () => {
    setIsSearching(true);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative cursor-pointer" onClick={handleInputClick}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            selectedOptions.length
              ? `${selectedOptions.length} seleccionados`
              : placeholder
          }
          className="w-full px-4 py-2.5 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSearchClick();
          }}
        >
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-h-34 overflow-y-auto overflow-x-hidden"
          role="listbox"
        >
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-gray-500 dark:text-gray-400">
              No se encontraron coincidencias
            </div>
          ) : (
            filteredOptions.map((option) => (
              <label
                key={option._id}
                className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
                role="option"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.name)}
                  onChange={() => toggleOption(option.name)}
                  className="mr-3 w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-800"
                  aria-label={`Seleccionar ${option.name}`}
                />
                <span>{option.displayName || option.name}</span>
              </label>
            ))
          )}
        </div>
      )}

      <input
        type="hidden"
        name={name}
        value={selectedOptions.length ? JSON.stringify(selectedOptions) : "[]"}
      />
    </div>
  );
}
