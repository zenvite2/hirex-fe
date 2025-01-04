import React from 'react';
import { Plus, X } from 'lucide-react';
import { Project } from './types';
import { Transition } from '@headlessui/react';

interface ProjectPopupProps {
    show: boolean;
    editingProject: Project;
    onClose: () => void;
    onSave: () => void;
    onUpdateProject: (key: keyof Project, value: string | number) => void;
}

const ProjectPopup: React.FC<ProjectPopupProps> = ({
    show,
    editingProject,
    onClose,
    onSave,
    onUpdateProject,
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
                            {editingProject.id ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
                        </h3>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                            <X />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">
                                Tên dự án <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editingProject.name}
                                onChange={(e) => onUpdateProject('name', e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Tên dự án"
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
                                    value={editingProject.startDate}
                                    onChange={(e) => onUpdateProject('startDate', e.target.value)}
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
                                    value={editingProject.endDate}
                                    onChange={(e) => onUpdateProject('endDate', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm mb-1">Số lượng người</label>
                                <input
                                    type="number"
                                    value={editingProject.teamSize}
                                    onChange={(e) => onUpdateProject('teamSize', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded"
                                    placeholder="Số lượng thành viên"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Vị trí công việc <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={editingProject.position}
                                    onChange={(e) => onUpdateProject('position', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Vị trí của bạn"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Mô tả dự án
                            </label>
                            <textarea
                                value={editingProject.description}
                                onChange={(e) => onUpdateProject('description', e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Mô tả dự án"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Đường link dự án (tùy chọn)</label>
                            <input
                                type="text"
                                value={editingProject.link || ''}
                                onChange={(e) => onUpdateProject('link', e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Đường link dự án (tùy chọn)"
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
        </Transition>
    );
};

export default ProjectPopup;