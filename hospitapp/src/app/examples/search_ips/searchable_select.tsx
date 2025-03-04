'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  options: Array<{ _id: string; name: string }>;
  placeholder: string;
  name: string;
}

export function SearchableSelect({ options, placeholder, name }: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Now stores names
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (name: string) => {
    setSelectedOptions(prev =>
      prev.includes(name)
        ? prev.filter(v => v !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex flex-wrap gap-1 p-1 border rounded-md">
        {/* Selected items */}
        {selectedOptions.map(name => (
          <span 
            key={name}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {name}
            <button
              type="button"
              onClick={() => toggleOption(name)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
        
        {/* Search input */}
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 min-w-[150px] p-1 border-none focus:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto border rounded-md bg-white shadow-lg">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-gray-500">No matches found</div>
          ) : (
            filteredOptions.map(option => (
              <label
                key={option._id}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.name)}
                  onChange={() => toggleOption(option.name)}
                  className="mr-2"
                />
                <span>{option.name}</span>
              </label>
            ))
          )}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(selectedOptions)}
      />
    </div>
  );
}