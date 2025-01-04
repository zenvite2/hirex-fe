import { Transition } from "@headlessui/react";
import React, { useEffect } from "react";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  // Tạo side effect để khóa cuộn khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';  // Vô hiệu hóa cuộn
    } else {
      document.body.style.overflow = '';  // Kích hoạt lại cuộn
    }

    return () => {
      document.body.style.overflow = '';  // Đảm bảo bật lại cuộn khi component unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition duration-300"
            >
              X
            </button>
          </div>
          <div className="mb-6">{children}</div>
          {footer && <div className="mt-4 flex justify-between space-x-4">{footer}</div>}
        </div>
      </div>
    </Transition >
  );
};

export default ReusableModal;
