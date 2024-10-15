import React from 'react';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = true,
}) => (
  <div>
    <label htmlFor={name} className="block text-xs font-medium text-gray-700">
      {label}
      {required && ' *'}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      placeholder={placeholder}
      required={required}
    />
  </div>
);