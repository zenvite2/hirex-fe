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

    const getWidthClass = () => {
        switch (width) {
            case "small":
                return "w-1/4";
            case "medium":
                return "w-1/2";
            case "large":
                return "w-3/4";
            default:
                return "w-1/2";
        }
    };

    const getHeightClass = () => {
        switch (height) {
            case "small":
                return "h-1/4";
            case "medium":
                return "h-1/2";
            case "large":
                return "h-3/4";
            default:
                return "h-1/2";
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
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
