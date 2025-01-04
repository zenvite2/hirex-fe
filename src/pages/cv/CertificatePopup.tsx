import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { Certificate } from './types';
import { Transition } from '@headlessui/react';

interface CertificatePopupProps {
    show: boolean;
    editingCertificate: Certificate;
    onClose: () => void;
    onSave: () => void;
    onUpdateCertificate: (key: keyof Certificate, value: string | number | Moment) => void;
}

const CertificatePopup: React.FC<CertificatePopupProps> = ({
    show,
    editingCertificate,
    onClose,
    onSave,
    onUpdateCertificate,
}) => {
    const [errors, setErrors] = useState<Partial<Record<keyof Certificate, string>>>({});

    // Validation function
    const validateCertificate = () => {
        const newErrors: Partial<Record<keyof Certificate, string>> = {};

        // Validate name
        if (!editingCertificate.name || editingCertificate.name.trim() === '') {
            newErrors.name = 'Tên chứng chỉ không được để trống';
        }

        // Validate start date
        if (!editingCertificate.startDate) {
            newErrors.startDate = 'Ngày bắt đầu không được để trống';
        }

        // Validate end date
        if (!editingCertificate.endDate) {
            newErrors.endDate = 'Ngày kết thúc không được để trống';
        } else if (editingCertificate.startDate && editingCertificate.endDate) {
            const startDate = moment(editingCertificate.startDate);
            const endDate = moment(editingCertificate.endDate);

            if (endDate.isSameOrBefore(startDate)) {
                newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        // Optional description validation
        if (editingCertificate.description && editingCertificate.description.length > 500) {
            newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Modify onSave to include validation
    const handleSave = () => {
        if (validateCertificate()) {
            onSave();
        }
    };

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
                            {editingCertificate.id ? 'Chỉnh sửa chứng chỉ' : 'Thêm chứng chỉ mới'}
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
                                    Tên chứng chỉ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editingCertificate.name}
                                    onChange={(e) => {
                                        onUpdateCertificate('name', e.target.value);
                                        setErrors(prev => ({ ...prev, name: undefined }));
                                    }}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                    ${errors.name
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                    placeholder="Nhập tên chứng chỉ"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
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
                                    placeholder="Chọn tháng/năm bắt đầu"
                                    format="MM/YYYY"
                                    value={editingCertificate.startDate ? moment(editingCertificate.startDate) : null}
                                    onChange={(date) => {
                                        onUpdateCertificate('startDate', date);
                                        setErrors(prev => ({ ...prev, startDate: undefined }));
                                    }}
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
                                    placeholder="Chọn tháng/năm kết thúc"
                                    format="MM/YYYY"
                                    value={editingCertificate.endDate ? moment(editingCertificate.endDate) : null}
                                    onChange={(date) => {
                                        onUpdateCertificate('endDate', date);
                                        setErrors(prev => ({ ...prev, endDate: undefined }));
                                    }}
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
                                value={editingCertificate.description}
                                onChange={(e) => {
                                    onUpdateCertificate('description', e.target.value);
                                    setErrors(prev => ({ ...prev, description: undefined }));
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                                ${errors.description
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                placeholder="Mô tả chi tiết về chứng chỉ"
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
        </Transition>
    );
};

export default CertificatePopup;