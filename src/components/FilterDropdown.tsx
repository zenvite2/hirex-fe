import React, { useState } from "react";
import { IconType } from "react-icons";
import { MdKeyboardArrowDown } from "react-icons/md";

interface FilterDropdownProps {
  label: string;
  icon: IconType;
  options: string[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, icon: Icon, options }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(label);

  const toggleDropdown = (): void => setIsOpen(!isOpen);

  const handleSelect = (option: string): void => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-sm">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full px-3 py-2 text-gray-700 hover:text-green-600 focus:outline-none"
          onClick={toggleDropdown}
        >
          <Icon className="mr-2 h-5 w-5" />
          {selectedOption}
          <MdKeyboardArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option, index) => (
              <a
                key={index}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => handleSelect(option)}
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
