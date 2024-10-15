import React, { useState, useEffect, useRef } from 'react';
import { Location } from './types';

interface LocationSelectorProps {
  label: string;
  placeholder: string;
  locations: Location[];
  value: string;
  onChange: (location: Location) => void;
  onSearch: (name: string) => void;
  disabled?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  placeholder,
  locations,
  value,
  onChange,
  onSearch,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !disabled) {
      inputRef.current?.focus();
    }
  }, [isOpen, disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  const handleSelectLocation = (location: Location) => {
    if (disabled) return;
    onChange(location);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearchTerm('');
    onChange({ id: 0, name: '' }); // Clear the selected value
  };

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        <input
          ref={inputRef}
          type="text"
          className={`block w-full px-2 py-1 text-sm border rounded-md ${
            disabled
              ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
              : 'border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500'
          }`}
          placeholder={placeholder}
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          disabled={disabled}
        />
      </div>
      {isOpen && !disabled && (
        <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {locations.map((location) => (
            <li
              key={location.id}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
              onClick={() => handleSelectLocation(location)}
            >
              {location.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};