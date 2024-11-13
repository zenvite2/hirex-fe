import React, { useState, useEffect, useRef } from 'react';
import { Location } from '../../components/registration/types';
import { MapPin } from 'lucide-react';

interface LocationSelectorProps {
  placeholder: string;
  locations: Location[];
  value: string;
  onChange: (location: Location) => void;
  onSearch: (name: string) => void;
  disabled?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
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
    setSearchTerm(newSearchTerm); // Lưu searchTerm khi người dùng gõ
    onSearch(newSearchTerm); // Tìm kiếm khi có thay đổi
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
    setSearchTerm(''); // Dọn dẹp searchTerm khi focus
    onChange({ id: 0, name: '' }); // Xóa giá trị đã chọn
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MapPin className="w-5 h-5 text-gray-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
          disabled
            ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500'
        }`}
        placeholder={placeholder}
        value={isOpen ? searchTerm : value} // Lúc này sử dụng searchTerm khi mở dropdown
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        disabled={disabled}
      />
  
      {isOpen && !disabled && (
        <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
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