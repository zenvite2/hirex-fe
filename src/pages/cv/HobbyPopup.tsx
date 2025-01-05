import React from 'react';
import { X } from 'lucide-react';
import { Transition } from '@headlessui/react';

interface HobbyPopupProps {
    show: boolean;
    editingHobby: string;
    onClose: () => void;
    onSave: () => void;
    setEditingHobby: (goal: string) => void;
    existingGoal?: string;
}

const HobbyPopup: React.FC<HobbyPopupProps> = ({
    show,
    editingHobby,
    onClose,
    onSave,
    setEditingHobby,
    existingGoal
}) => {

    return (
        <Transition
            show={show}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 transform scale-95 translate-y-4"
            enterTo="opacity-100 transform scale-100 translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 transform scale-100 translate-y-0"
            leaveTo="opacity-0 transform scale-95 translate-y-4"
        >
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {existingGoal ? 'Chỉnh sửa sở thích' : 'Thêm sở thích'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <X />
                        </button>
                    </div>
                    <textarea
                        value={editingHobby}
                        onChange={(e) => setEditingHobby(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Sở thích"
                        rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    );
};

export default HobbyPopup;