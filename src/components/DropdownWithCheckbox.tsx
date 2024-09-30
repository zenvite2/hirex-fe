import React, { useState, useRef, useEffect } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface DropdownWithCheckboxProps {
    label: string;
    options: string[];
}

const DropdownWithCheckbox: React.FC<DropdownWithCheckboxProps> = ({ label, options }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    const toggleDropdown = () => setIsOpen(!isOpen);
  
    const handleOptionChange = (option: string) => {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    };
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownRef]);
  
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div
          className="flex items-center cursor-pointer p-2 border border-gray-300 rounded-lg hover:text-green-600"
          onClick={toggleDropdown}
        >
          <span>{label}</span>
          <MdOutlineKeyboardArrowDown className="ml-1" />
        </div>
  
        {isOpen && (
          <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1"> {/* Xóa các thuộc tính cuộn */}
              {options.map((option, index) => (
                <label key={index} className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default DropdownWithCheckbox;
