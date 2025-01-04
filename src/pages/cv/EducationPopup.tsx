import React from 'react';
import { Plus, X } from 'lucide-react';
import { Education } from './types';
import { Transition } from '@headlessui/react';

interface EducationPopupProps {
    show: boolean;
    editingEducation: Education;
    onClose: () => void;
    onSave: () => void;
    onUpdateEducation: (key: keyof Education, value: string | number) => void;
}

const EducationPopup: React.FC<EducationPopupProps> = ({
    show,
    editingEducation,
    onClose,
    onSave,
    onUpdateEducation,
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            {editingEducation.id ? 'Chỉnh sửa học vấn' : 'Thêm học vấn'}
                        </h3>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                            <X />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">
                                Tên trường <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editingEducation.name}
                                onChange={(e) => onUpdateEducation('name', e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Tên trường"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Ngàng học <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editingEducation.major}
                                onChange={(e) => onUpdateEducation('major', e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Ngành học"
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
                                    value={editingEducation.startDate}
                                    onChange={(e) => onUpdateEducation('startDate', e.target.value)}
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
                                    value={editingEducation.endDate}
                                    onChange={(e) => onUpdateEducation('endDate', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                GPA
                            </label>
                            <input
                                type="text"
                                value={editingEducation.gpa}
                                onChange={(e) => onUpdateEducation('gpa', e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="gpa"
                            />
                        </div>

                        {/* <div>
                        <label className="block text-sm mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={editingEducation.description}
                            onChange={(e) => editingEducation('description', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Mô tả chứng chỉ"
                            rows={3}
                            required
                        />
                    </div> */}
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
            </div >
        </Transition>
    );
};

export default EducationPopup;