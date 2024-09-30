import React from "react";

interface CustomButtonProps {
  title: string; 
  containerStyles?: string;
  iconRight?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  containerStyles = "", 
  iconRight,
  type = "button", 
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`inline-flex items-center ${containerStyles}`}
    >
      {title}
      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
