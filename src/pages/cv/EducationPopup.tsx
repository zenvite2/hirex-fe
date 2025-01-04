import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Education } from './types';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';

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

    const [errors, setErrors] = useState<Partial<Record<keyof Education, string>>>({});

    // Validation function
    const validateEducation = () => {
        const newErrors: Partial<Record<keyof Education, string>> = {};

        // Validate name
        if (!editingEducation.name || editingEducation.name.trim() === '') {
            newErrors.name = 'Tên trường không được để trống';
        }

        if (!editingEducation.major || editingEducation.major.trim() === '') {
            newErrors.name = 'Ngành học không được để trống';
        }

        // Validate start date
        if (!editingEducation.startDate) {
            newErrors.startDate = 'Ngày bắt đầu không được để trống';
        }

        // Validate end date
        if (!editingEducation.endDate) {
            newErrors.endDate = 'Ngày kết thúc không được để trống';
        } else if (editingEducation.startDate && editingEducation.endDate) {
            const startDate = moment(editingEducation.startDate);
            const endDate = moment(editingEducation.endDate);

            if (endDate.isSameOrBefore(startDate)) {
                newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        if (editingEducation.gpa && editingEducation.gpa.toString().trim() !== '') {
            const gpaValue = parseFloat(editingEducation.gpa as string);
            if (isNaN(gpaValue)) {
                newErrors.gpa = 'GPA phải là số';
            } else if (gpaValue < 0 || gpaValue > 4.0) {
                newErrors.gpa = 'GPA phải nằm trong khoảng từ 0.0 đến 4.0';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDateChange = (field: 'startDate' | 'endDate', value: Moment | null) => {
        const dateString = value ? value.format('MM/YYYY') : '';
        onUpdateEducation(field, dateString);
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Chỉ cho phép nhập số và dấu chấm
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            onUpdateEducation('gpa', value);
            setErrors(prev => ({ ...prev, gpa: undefined }));
        }
    };

    const handleSave = () => {
        if (validateEducation()) {
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
                        {editingEducation.id ? 'Chỉnh sửa học vấn' : 'Thêm học vấn'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên trường <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editingEducation.name}
                                onChange={(e) => {
                                    onUpdateEducation('name', e.target.value);
                                    setErrors(prev => ({ ...prev, name: undefined }));
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                    ${errors.name
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                placeholder="Nhập tên trường"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            Ngành học <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={editingEducation.major}
                            onChange={(e) => onUpdateEducation('major', e.target.value)}
                            className={`w-full p-2 border rounded ${errors.major ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ngành học"
                        />
                        {errors.major && (
                            <p className="text-red-500 text-xs mt-1">{errors.major}</p>
                        )}
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
                                value={editingEducation.startDate ? moment(editingEducation.startDate, 'MM/YYYY') : null}
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
                                value={editingEducation.endDate ? moment(editingEducation.endDate, 'MM/YYYY') : null}
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
                        <label className="block text-sm mb-1">
                            GPA
                        </label>
                        <input
                            type="text"
                            value={editingEducation.gpa}
                            onChange={handleGPAChange}
                            className={`w-full p-2 border rounded ${errors.gpa ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Nhập GPA (0.0 - 4.0)"
                        />
                        {errors.gpa && (
                            <p className="text-red-500 text-xs mt-1">{errors.gpa}</p>
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
        </div >
    );
};

export default EducationPopup;