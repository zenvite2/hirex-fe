import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Experience } from './types';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';

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
    const [errors, setErrors] = useState<Partial<Record<keyof Experience, string>>>({});

    // Validation function
    const validateProject = () => {
        const newErrors: Partial<Record<keyof Experience, string>> = {};
        if (!editingExperience.company || editingExperience.company.trim() === '') {
            newErrors.company = 'Tên công ty không được để trống';
        }

        if (!editingExperience.position || editingExperience.position.trim() === '') {
            newErrors.position = 'Vị trí công việc không được để trống';
        }

        // Validate start date
        if (!editingExperience.startDate) {
            newErrors.startDate = 'Ngày bắt đầu không được để trống';
        }

        // Validate end date
        if (!editingExperience.endDate) {
            newErrors.endDate = 'Ngày kết thúc không được để trống';
        } else if (editingExperience.startDate && editingExperience.endDate) {
            const startDate = moment(editingExperience.startDate);
            const endDate = moment(editingExperience.endDate);

            if (endDate.isSameOrBefore(startDate)) {
                newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDateChange = (field: 'startDate' | 'endDate', value: Moment | null) => {
        const dateString = value ? value.format('MM/YYYY') : '';
        onUpdateExperience(field, dateString);
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };


    const handleSave = () => {
        if (validateProject()) {
            onSave();
        }
    };

    useEffect(() => {
        setErrors({});
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingExperience.id ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm mb-1">
                                Tên công ty <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editingExperience.company}
                                onChange={(e) => {
                                    onUpdateExperience('company', e.target.value);
                                    setErrors(prev => ({ ...prev, name: undefined }));
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                    ${errors.position
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                placeholder="Nhập tên trường"
                            />
                            {errors.company && (
                                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Vị trí công việc <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={editingExperience.position}
                                onChange={(e) => {
                                    onUpdateExperience('position', e.target.value);
                                    setErrors(prev => ({ ...prev, name: undefined }));
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                    ${errors.position
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                placeholder="Nhập tên trường"
                            />
                            {errors.position && (
                                <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                picker="month"
                                style={{ width: '100%' }}
                                placeholder="MM/YYYY"
                                format="MM/YYYY"
                                value={editingExperience.startDate ? moment(editingExperience.startDate, 'MM/YYYY') : null}
                                onChange={(date) => handleDateChange('startDate', date)}
                                disabledDate={(current) => current && current > moment()}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                    ${errors.startDate
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {errors.startDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                picker="month"
                                style={{ width: '100%' }}
                                placeholder="MM/YYYY"
                                format="MM/YYYY"
                                value={editingExperience.endDate ? moment(editingExperience.endDate, 'MM/YYYY') : null}
                                onChange={(date) => handleDateChange('endDate', date)}
                                // disabledDate={(current) => current && current > moment()}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                    ${errors.endDate
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            />
                            {errors.endDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            value={editingExperience.description}
                            onChange={(e) => {
                                onUpdateExperience('description', e.target.value);
                                setErrors(prev => ({ ...prev, description: undefined }));
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                ${errors.description
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                            placeholder="Mô tả chi tiết về kinh nghiệm"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExperiencePopup;