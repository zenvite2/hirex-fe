import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { experienceCreate, experienceUpdate } from '../../services/experienceApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { positionList } from '../../services/autofillApi';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Transition } from '@headlessui/react';

interface Experience {
  id?: number;
  companyName: string;
  position: number;
  startDate: string;
  endDate: string;
  description: string;
  yearExperience: number;
}

interface ExperienceRequestData {
  companyName: string;
  position: number;
  startDate: string;
  endDate: string;
  description: string;
  yearExperience: number;
}

interface Type {
  id: number;
  name: string;
}

interface ExperiencePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Experience) => void;
  experience: Experience | null;
  editingExperience?: Experience;
}

const ExperiencePopup: React.FC<ExperiencePopupProps> = ({ isOpen, onClose, onSave, experience, editingExperience }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positionType, setPositions] = useState<Type[]>([]);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Experience>({
    companyName: '',
    position: 1,
    startDate: '',
    endDate: '',
    description: '',
    yearExperience: 0
  });

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      setFormData({
        companyName: '',
        position: 1,
        startDate: '',
        endDate: '',
        description: '',
        yearExperience: 0
      });
    }
  }, [experience]);

  const [errors, setErrors] = useState<Partial<Record<keyof Experience, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Experience]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  const handleDateChange = (name: 'startDate' | 'endDate', date: moment.Moment | null) => {
    const dateString = date ? date.format('MM/YYYY') : '';
    setFormData((prev) => ({ ...prev, [name]: dateString }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const [positionResult] = await Promise.all([
          dispatch(positionList()).unwrap(),
        ]);

        if (positionResult.response?.data) {
          setPositions(positionResult.response.data);
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    };

    fetchJobTypes();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Experience, string>> = {};

    if (!formData.companyName) {
      newErrors.companyName = 'Vui lòng nhập tên công ty';
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
      const experienceData: ExperienceRequestData = {
        companyName: formData.companyName,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || '',
        yearExperience: formData.yearExperience,
      };

      let result;

      if (experience?.id) {
        result = await dispatch(experienceUpdate({
          id: experience.id,
          info: experienceData
        }));
      } else {
        result = await dispatch(experienceCreate(experienceData));
      }

      if (
        (experienceCreate.fulfilled.match(result) || experienceUpdate.fulfilled.match(result)) &&
        result.payload?.response?.success
      ) {
        toast.success(
          experience?.id
            ? 'Cập nhật kinh nghiệm thành công!'
            : 'Thêm thông kinh nghiệm thành công!'
        );

        // Gọi onSave với dữ liệu education đã được cập nhật
        const updatedExperience: Experience = {
          id: experience?.id || result.payload.response.data.id,
          companyName: formData.companyName,
          position: formData.position,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
          yearExperience: formData.yearExperience,
        };
        onSave(updatedExperience);
        onClose();
      } else {
        toast.error(
          experience?.id
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
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>

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
              {errors.position && (
                <p className="mt-1 text-sm text-red-500">{errors.position}</p>
              )}
            </div>

            <div className="mb-4 flex justify-between">
              <div className="w-1/2 pr-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  name="startDate"
                  value={formData.startDate ? moment(formData.startDate, 'MM/YYYY') : null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  disabled={isSubmitting}
                  format="MM/YYYY"
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
                  name="endDate"
                  value={formData.endDate ? moment(formData.endDate, 'MM/YYYY') : null}
                  onChange={(date) => handleDateChange('endDate', date)}
                  disabled={isSubmitting}
                  format="MM/YYYY"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
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
    </Transition>
  );
};

export default ExperiencePopup;