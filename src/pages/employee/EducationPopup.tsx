import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { educationCreate, educationUpdate } from '../../services/educationApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { educationList } from '../../services/autofillApi';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Transition } from '@headlessui/react';

interface Education {
  id?: number;
  educationLevelId: number;
  universityName: string;
  expertise: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationRequestData {
  universityName: string;
  educationLevelId: number;
  expertise: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Education) => void;
  education: Education | null;
}

interface EducationLevel {
  id: number;
  name: string;
}

const EducationForm: React.FC<EducationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  education
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);

  const [formData, setFormData] = useState<Education>({
    educationLevelId: 0,
    universityName: '',
    expertise: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Education, string>>>({});

  useEffect(() => {
    const fetchEducationLevels = async () => {
      try {
        const result = await dispatch(educationList());
        if (result.payload?.response?.success) {
          setEducationLevels(result.payload.response.data);
        }
      } catch (error) {
        console.error('Failed to fetch education levels:', error);
        toast.error('Không thể tải danh sách trình độ học vấn');
      }
    };

    fetchEducationLevels();
  }, [dispatch]);

  useEffect(() => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        educationLevelId: 0,
        universityName: '',
        expertise: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
    setErrors({});
  }, [education, isOpen]);

  const handleDateChange = (name: 'startDate' | 'endDate', value: moment.Moment | null) => {
    const dateString = value ? value.format('MM/YYYY') : '';
    setFormData(prev => ({ ...prev, [name]: dateString }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'educationLevelId') {
      const levelId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        educationLevelId: levelId
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is changed
    if (errors[name as keyof Education]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Education, string>> = {};

    if (!formData.educationLevelId) {
      newErrors.educationLevelId = 'Vui lòng chọn trình độ học vấn';
    }
    if (!formData.universityName.trim()) {
      newErrors.universityName = 'Vui lòng nhập tên trường';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const educationData: EducationRequestData = {
        universityName: formData.universityName,
        educationLevelId: formData.educationLevelId,
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

        const updatedEducation: Education = {
          id: education?.id || result.payload.response.data.id,
          educationLevelId: formData.educationLevelId,
          universityName: formData.universityName,
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

  const renderEducationLevelSelect = () => {
    return (
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Trình độ học vấn <span className="text-red-500">*</span>
        </label>
        <select
          name="educationLevelId"
          value={formData.educationLevelId || ''}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.educationLevelId ? 'border-red-500' : 'border-gray-300'
            }`}
        >
          <option value="">Vui lòng chọn</option>
          {educationLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
        {errors.educationLevelId && (
          <p className="mt-1 text-sm text-red-500">{errors.educationLevelId}</p>
        )}
      </div>
    );
  };


  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 transform scale-95 translate-y-4"
      enterTo="opacity-100 transform scale-100 translate-y-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 transform scale-100 translate-y-0"
      leaveTo="opacity-0 transform scale-95 translate-y-4"
    >
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
            {renderEducationLevelSelect()}

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tên trường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.universityName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Nhập tên trường"
              />
              {errors.universityName && (
                <p className="mt-1 text-sm text-red-500">{errors.universityName}</p>
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
                <DatePicker
                  placeholder="MM/YYYY"
                format="MM/YYYY"
                picker="month"
                  value={formData.startDate ? moment(formData.startDate, 'MM/YYYY') : null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  disabledDate={(current) => current && current > moment()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>
              <div className="w-1/2 pl-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  placeholder="MM/YYYY"
                format="MM/YYYY"
                picker="month"
                  value={formData.endDate ? moment(formData.endDate, 'MM/YYYY') : null}
                  onChange={(date) => handleDateChange('endDate', date)}
                  // disabledDate={(current) => current && current > moment()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

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
    </Transition>
  );
};

export default EducationForm;