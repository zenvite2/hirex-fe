import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { educationCreate, educationUpdate } from '../../services/educationApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';

// Định nghĩa interface cho Education
interface Education {
  id?: number;
  level: string;
  nameSchool: string;
  expertise: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Định nghĩa interface cho API request data
interface EducationRequestData {
  universityName: string;
  level: string;
  expertise: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Định nghĩa interface cho component props
interface EducationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Education) => void;  // Giữ nguyên kiểu này để khớp với handleSaveEducation
  education: Education | null;
}

const EDUCATION_LEVELS = [
  { value: 'UNIVERSITY', label: 'Đại học' },
  { value: 'MASTER', label: 'Thạc sĩ' },
  { value: 'PHD', label: 'Tiến sĩ' },
  { value: 'COLLEGE', label: 'Cao đẳng' },
  { value: 'HIGH_SCHOOL', label: 'Trung học phổ thông' },
];

const EducationForm: React.FC<EducationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  education
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Education>({
    level: '',
    nameSchool: '',
    expertise: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Education, string>>>({});

  useEffect(() => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        level: '',
        nameSchool: '',
        expertise: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
    // Reset errors when form is opened/closed
    setErrors({});
  }, [education, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Education, string>> = {};

    if (!formData.level) {
      newErrors.level = 'Vui lòng chọn trình độ học vấn';
    }
    if (!formData.nameSchool.trim()) {
      newErrors.nameSchool = 'Vui lòng nhập tên trường';
    }
    if (!formData.expertise.trim()) {
      newErrors.expertise = 'Vui lòng nhập chuyên môn';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    if (errors[name as keyof Education]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const educationData: EducationRequestData = {
        universityName: formData.nameSchool,
        level: formData.level,
        expertise: formData.expertise,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || ''
      };

      let result;

      if (education?.id) {
        result = await dispatch(educationUpdate({
          id: education.id,
          info: educationData
        }));
      } else {
        result = await dispatch(educationCreate(educationData));
      }

      if (
        (educationCreate.fulfilled.match(result) || educationUpdate.fulfilled.match(result)) &&
        result.payload?.response?.success
      ) {
        toast.success(
          education?.id
            ? 'Cập nhật thông tin học vấn thành công!'
            : 'Thêm thông tin học vấn thành công!'
        );

        // Gọi onSave với dữ liệu education đã được cập nhật
        const updatedEducation: Education = {
          id: education?.id || result.payload.response.data.id,
          level: formData.level,
          nameSchool: formData.nameSchool,
          expertise: formData.expertise,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description
        };
        onSave(updatedEducation);
        onClose();
      } else {
        toast.error(
          education?.id
            ? 'Cập nhật thông tin học vấn thất bại!'
            : 'Thêm thông tin học vấn thất bại!'
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
            {education?.id ? 'Cập nhật học vấn' : 'Thêm học vấn'}
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Trình độ học vấn <span className="text-red-500">*</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.level ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Vui lòng chọn</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.level && (
              <p className="mt-1 text-sm text-red-500">{errors.level}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tên trường <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nameSchool"
              value={formData.nameSchool}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nameSchool ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Nhập tên trường"
            />
            {errors.nameSchool && (
              <p className="mt-1 text-sm text-red-500">{errors.nameSchool}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Chuyên môn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expertise ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Nhập chuyên môn"
            />
            {errors.expertise && (
              <p className="mt-1 text-sm text-red-500">{errors.expertise}</p>
            )}
          </div>

          <div className="mb-4 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            <div className="w-1/2 pl-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Quá trình học vấn
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="(Tùy chọn) Mô tả quá trình học vấn"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : education?.id ? 'Cập nhật' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm;