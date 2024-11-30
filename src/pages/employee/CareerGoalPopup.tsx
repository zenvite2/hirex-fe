import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { careergoalCreate, careergoalUpdate } from '../../services/careergoalApi';
import { jobTypeList, positionList, industryList } from '../../services/autofillApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';

interface CareerGoal {
    id?: number;
    position: number;
    minSalary: number | null;
    maxSalary: number | null;
    jobType: number;
    industry: number;
}

interface CareerGoalPopups {
    isOpen: boolean;
    onClose: () => void;
    onSave: (careergoal: CareerGoal) => void;
    careergoal: CareerGoal | null;
}

interface Type {
    id: number;
    name: string;
}

const CareerGoalPopup: React.FC<CareerGoalPopups> = ({ isOpen, onClose, onSave, careergoal }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jobTypes, setJobTypes] = useState<Type[]>([]);
    const [positionType, setPositions] = useState<Type[]>([]);
    const [industry, setIndustry] = useState<Type[]>([]);

    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<CareerGoal>({
        position: 1,
        minSalary: null,
        maxSalary: null,
        jobType: 1,
        industry: 1,
    });

    useEffect(() => {
        const fetchJobTypes = async () => {
            try {
                const [positionResult, jobTypeResult, industryResult] = await Promise.all([
                    dispatch(positionList()).unwrap(),
                    dispatch(jobTypeList()).unwrap(),
                    dispatch(industryList()).unwrap(),
                ]);
          
                if (positionResult.response?.data) {
                    setPositions(positionResult.response.data);
                }
                if (jobTypeResult.response?.data) {
                    setJobTypes(jobTypeResult.response.data);
                }
                if (industryResult.response?.data) {
                    setIndustry(industryResult.response.data);
                }
            } catch (error) {
                toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            }
        };

        fetchJobTypes();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (careergoal) {
                setFormData(careergoal);
            } else {
                setFormData({
                    industry: jobTypes.length > 0 ? jobTypes[0].id : 1,
                    position: jobTypes.length > 0 ? jobTypes[0].id : 1,
                    minSalary: null,
                    maxSalary: null,
                    jobType: jobTypes.length > 0 ? jobTypes[0].id : 1,
                });
            }
        }
    }, [careergoal, isOpen, jobTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let updatedValue: string | number | null = value;
        
        if (name === 'minSalary' || name === 'maxSalary') {
            // Chỉ lấy số từ input
            const numericValue = value.replace(/[^0-9]/g, '');
            updatedValue = numericValue ? parseInt(numericValue) : null;
        } else if (name === 'jobType' || name === 'position' || name == 'industry') {
            updatedValue = parseInt(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: updatedValue
        }));
    };

    const formatSalaryInput = (value: number | null): string => {
        return value ? new Intl.NumberFormat('vi-VN').format(value) : '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Kiểm tra mức lương min <= max
        if (formData.minSalary && formData.maxSalary && formData.minSalary > formData.maxSalary) {
            toast.error('Mức lương tối thiểu phải nhỏ hơn hoặc bằng mức lương tối đa');
            setIsSubmitting(false);
            return;
        }

        try {
            const careergoalData = {
                position: Number(formData.position),
                minSalary: formData.minSalary,
                maxSalary: formData.maxSalary,
                jobType: Number(formData.jobType),
                industry: Number(formData.industry)
            };

            let result;
            if (careergoal?.id) {
                result = await dispatch(careergoalUpdate({
                    id: careergoal.id,
                    info: careergoalData
                }));
            } else {
                result = await dispatch(careergoalCreate(careergoalData));
            }

            const isSuccess = result.payload?.response?.success;
            if (isSuccess) {
                toast.success(careergoal?.id ? 'Cập nhật mục tiêu thành công!' : 'Tạo mục tiêu mới thành công!');

                const updatedCareerGoal: CareerGoal = {
                    id: result.payload?.response?.data?.id || careergoal?.id,
                    ...careergoalData
                };
                onSave(updatedCareerGoal);
                onClose();
            } else {
                toast.error(careergoal?.id ? 'Cập nhật thông tin mục tiêu thất bại!' : 'Tạo mục tiêu mới thất bại!');
            }
        } catch (error) {
            console.error('Failed to save career goal:', error);
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        {careergoal?.id ? 'Cập nhật mục tiêu' : 'Tạo mục tiêu mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Vị trí <span className="text-red-500">*</span></label>
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {positionType.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium">Mức lương tối thiểu <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="minSalary"
                                    value={formatSalaryInput(formData.minSalary)}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    VNĐ
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Mức lương tối đa <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="maxSalary"
                                    value={formatSalaryInput(formData.maxSalary)}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    VNĐ
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Loại công việc <span className="text-red-500">*</span></label>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {jobTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Ngành nghề <span className="text-red-500">*</span></label>
                        <select
                            name="industry"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {industry.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isSubmitting ? 'Đang xử lý...' : (careergoal?.id ? 'Cập nhật' : 'Tạo mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CareerGoalPopup;