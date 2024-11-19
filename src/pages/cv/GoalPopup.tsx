import React from 'react';
import { X } from 'lucide-react';

interface GoalPopupProps {
    show: boolean;
    editingGoal: string;
    onClose: () => void;
    onSave: () => void;
    setEditingGoal: (goal: string) => void;
    existingGoal?: string;
}

const GoalPopup: React.FC<GoalPopupProps> = ({
    show,
    editingGoal,
    onClose,
    onSave,
    setEditingGoal,
    existingGoal
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                        {existingGoal ? 'Chỉnh Sửa Mục Tiêu' : 'Thêm Mục Tiêu Mới'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <X />
                    </button>
                </div>
                <textarea
                    value={editingGoal}
                    onChange={(e) => setEditingGoal(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Nhập mục tiêu nghề nghiệp"
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
    );
};

export default GoalPopup;