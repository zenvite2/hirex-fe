import { Transition } from "@headlessui/react";
import React, { useRef, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: "small" | "medium" | "large";
    height?: "small" | "medium" | "large";
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

    const getWidthClasses = () => {
        switch (width) {
            case "small":
                return "min-w-[25%] max-w-[75%]";
            case "medium":
                return "min-w-[50%] max-w-[75%]";
            case "large":
                return "min-w-[75%] max-w-[75%]";
            default:
                return "min-w-[50%] max-w-[75%]";
        }
    };

    const getHeightClasses = () => {
        switch (height) {
            case "small":
                return "min-h-[25%] max-h-[75%]";
            case "medium":
                return "min-h-[50%] max-h-[75%]";
            case "large":
                return "min-h-[75%] max-h-[75%]";
            default:
                return "min-h-[50%] max-h-[75%]";
        }
    };

    return (
        <Transition
            show={isOpen}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 transform scale-95 translate-y-4"
            enterTo="opacity-100 transform scale-100 translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 transform scale-100 translate-y-0"
            leaveTo="opacity-0 transform scale-95 translate-y-4"
        >
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                <div
                    ref={modalRef}
                    className={`bg-white rounded-lg p-8 shadow-lg relative mx-auto ${getWidthClasses()} ${getHeightClasses()} flex`}
                >
                    {children}
                </div>
            </div>
        </Transition>
    );
};

export default CustomModal;