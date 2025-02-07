import React from "react";

interface Option {
  id: number;
  name: string;
}

interface CheckboxDropdownProps {
  icon: React.ElementType;
  title: string;
  options: Option[];
  selectedValues: number[];
  onChange: (values: number[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({
  icon: Icon,
  title,
  options,
  selectedValues,
  onChange,
  isOpen,
  onToggle,
}) => {
  // Hàm xử lý khi thay đổi checkbox
  const handleOptionChange = (value: number) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className="relative">
      <div onClick={onToggle} className="flex items-center justify-between p-2 border rounded-lg cursor-pointer bg-white">
        <div className="flex items-center">
          <Icon className="mr-2 text-gray-600" />
          <span className="text-gray-700">{title}</span>
        </div>
        <span className="text-gray-400"></span>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <label key={option.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.id}
                  checked={selectedValues.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                  className="mr-2"
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckboxDropdown;
