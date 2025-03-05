'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  options: Array<{ _id: string; name: string }>;
  placeholder: string;
  name: string;
}

export function SearchableSelect({ options, placeholder, name }: SearchableSelectProps) {
  const [_SEARCH_TERM, set_search_term] = useState('');
  const [_IS_OPEN, set_is_open] = useState(false);
  const [_SELECTED_OPTIONS, set_selected_options] = useState<string[]>([]); // Now stores names
  const _WRAPPER_REF = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const _FILTERED_OPTIONS = options.filter(option =>
    option.name.toLowerCase().includes(_SEARCH_TERM.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (_WRAPPER_REF.current && !_WRAPPER_REF.current.contains(event.target as Node)) {
        set_is_open(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const _TOGGLE_OPTION = (name: string) => {
    set_selected_options(prev =>
      prev.includes(name)
        ? prev.filter(v => v !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="relative" ref={_WRAPPER_REF}>
      <div className="flex flex-wrap gap-1 p-1 border rounded-md">
        {/* Selected items */}
        {_SELECTED_OPTIONS.map(name => (
          <span 
            key={name}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {name}
            <button
              type="button"
              onClick={() => _TOGGLE_OPTION(name)}
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
          value={_SEARCH_TERM}
          onChange={(e) => set_search_term(e.target.value)}
          onFocus={() => set_is_open(true)}
        />
      </div>

      {/* Dropdown list */}
      {_IS_OPEN && (
        <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto border rounded-md bg-white shadow-lg">
          {_FILTERED_OPTIONS.length === 0 ? (
            <div className="p-2 text-gray-500">No matches found</div>
          ) : (
            _FILTERED_OPTIONS.map(option => (
              <label
                key={option._id}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={_SELECTED_OPTIONS.includes(option.name)}
                  onChange={() => _TOGGLE_OPTION(option.name)}
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
        value={JSON.stringify(_SELECTED_OPTIONS)}
      />
    </div>
  );
}