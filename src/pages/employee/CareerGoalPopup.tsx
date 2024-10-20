import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { experienceCreate, experienceUpdate } from '../../services/experienceApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';

interface CareerGoal {
    id?: number;
    position: string;
    description: string;
}

interface CareerGoalRequestData {
    position: string;
    description: string;
}


interface CareerGoalPopups {
    isOpen: boolean;
    onClose: () => void;
    onSave: (careergoal: CareerGoal) => void;
    careergoal: CareerGoal | null;
    editingCareerGoal?: CareerGoal;
}

const CareerGoalPopup: React.FC<CareerGoalPopups> = ({ isOpen, onClose, onSave, careergoal, editingCareerGoal }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<CareerGoal>({
        position: '',
        description: '',
    });

    useEffect(() => {
        if (careergoal) {
            setFormData(careergoal);
        } else {
            setFormData({
                position: '',
                description: '',
            });
        }
    }, [careergoal]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const careergoalData: CareerGoalRequestData = {
                position: formData.position,
                description: formData.description || '',
            };

            let result;

            if (careergoal?.id) {
                result = await dispatch(experienceUpdate({
                    id: careergoal.id,
                    info: careergoalData
                }));
            } else {
                result = await dispatch(experienceCreate(careergoalData));
            }

            if (
                (experienceCreate.fulfilled.match(result) || experienceUpdate.fulfilled.match(result)) &&
                result.payload?.response?.success
            ) {
                toast.success(
                    careergoal?.id
                        ? 'Cập nhật kinh nghiệm thành công!'
                        : 'Thêm thông kinh nghiệm thành công!'
                );

                // Gọi onSave với dữ liệu education đã được cập nhật
                const updatedExperience: CareerGoal = {
                    id: careergoal?.id || result.payload.response.data.id,
                    position: formData.position,
                    description: formData.description,
                };
                onSave(updatedExperience);
                onClose();
            } else {
                toast.error(
                    careergoal?.id
                        ? 'Cập nhật thông tin kinh nghiệm thất bại!'
                        : 'Thêm thông tin kinh nghiệm thất bại!'
                );
            }
        } catch (error) {
            console.error('Failed to save education:', error);
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
                        {/* {education?.id ? 'Cập nhật học vấn' : 'Thêm học vấn'} */}
                        Thêm kinh nghiệm
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
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
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
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CareerGoalPopup;