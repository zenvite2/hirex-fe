import React from 'react';
import { Plus, X } from 'lucide-react';
import { Experience } from './types';

interface ExperiencePopupProps {
    show: boolean;
    editingExperience: Experience;
    onClose: () => void;
    onSave: () => void;
    onUpdateExperience: (key: keyof Experience, value: string | number) => void;
}

const ExperiencePopup: React.FC<ExperiencePopupProps> = ({
    show,
    editingExperience,
    onClose,
    onSave,
    onUpdateExperience,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                        {editingExperience.id ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm mới'}
                    </h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <X />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">
                            Tên công ty <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editingExperience.company}
                            onChange={(e) => onUpdateExperience('company', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Tên công ty"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                           Vị trí <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editingExperience.company}
                            onChange={(e) => onUpdateExperience('position', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Vị trí"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm mb-1">
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={editingExperience.startDate}
                                onChange={(e) => onUpdateExperience('startDate', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={editingExperience.endDate}
                                onChange={(e) => onUpdateExperience('endDate', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={editingExperience.description}
                            onChange={(e) => onUpdateExperience('description', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Mô tả chứng chỉ"
                            rows={3}
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
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

export default ExperiencePopup;