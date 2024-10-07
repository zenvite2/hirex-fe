import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  placeholder,
  type,
  required,
  register,
  error,
}) => {
  return (
    <div className='flex flex-col'>
      <label htmlFor={name} className='text-gray-600 text-sm mb-1'>
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        required={required}
        {...register}
        className={`rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && (
        <span role='alert' className='text-xs text-red-500 mt-0.5'>
          {error}
        </span>
      )}
    </div>
  );
};

export default TextInput;
