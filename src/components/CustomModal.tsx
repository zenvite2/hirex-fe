import React, { useRef, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width: "small" | "medium" | "large";
    height: "small" | "medium" | "large";
}

const CustomModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    width = "medium",
    height = "medium"
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle click outside the modal content
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Determine modal width based on width prop
    const getWidthClass = () => {
        switch (width) {
            case "small":
                return "w-1/4"; // 25% of viewport width
            case "medium":
                return "w-1/2"; // 50% of viewport width
            case "large":
                return "w-3/4"; // 75% of viewport width
            default:
                return "w-1/2"; // Default to medium width
        }
    };

    // Determine modal height based on height prop
    const getHeightClass = () => {
        switch (height) {
            case "small":
                return "h-1/4"; // 25% of viewport height
            case "medium":
                return "h-1/2"; // 50% of viewport height
            case "large":
                return "h-3/4"; // 75% of viewport height
            default:
                return "h-1/2"; // Default to medium height
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className={`bg-white rounded-lg p-8 shadow-lg relative mx-auto ${getWidthClass()} ${getHeightClass()} flex`}
            >
                {children}
            </div>
        </div>
    );
};

export default CustomModal;
