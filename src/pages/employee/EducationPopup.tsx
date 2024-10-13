import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Education {
  id?: number;
  degree: string;
  school: string;
  major: string;
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

const EducationForm: React.FC<EducationFormProps> = ({ isOpen, onClose, onSave, education }) => {
  const [formData, setFormData] = useState<Education>({
    degree: '',
    school: '',
    major: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  useEffect(() => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        degree: '',
        school: '',
        major: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  }, [education]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Học vấn</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Trình độ học vấn *</label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Vui lòng chọn</option>
              <option value="bachelors">Cử nhân</option>
              <option value="masters">Thạc sĩ</option>
              <option value="phd">Tiến sĩ</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Tên trường *</label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Vui lòng chọn</option>
              <option value="university1">Đại học 1</option>
              <option value="university2">Đại học 2</option>
              <option value="university3">Đại học 3</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Chuyên môn *</label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Vui lòng chọn</option>
              <option value="computerScience">Khoa học máy tính</option>
              <option value="engineering">Kỹ thuật</option>
              <option value="business">Kinh doanh</option>
            </select>
          </div>
          <div className="mb-4 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Ngày Bắt Đầu *</label>
              <div className="flex">
                <select
                  name="startDateMonth"
                  value={formData.startDate.split('-')[1] || ''}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">...</option>
                  {/* Add month options here */}
                </select>
                <select
                  name="startDateYear"
                  value={formData.startDate.split('-')[0] || ''}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">...</option>
                  {/* Add year options here */}
                </select>
              </div>
            </div>
            <div className="w-1/2 pl-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Ngày Kết Thúc *</label>
              <div className="flex">
                <select
                  name="endDateMonth"
                  value={formData.endDate.split('-')[1] || ''}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">...</option>
                  {/* Add month options here */}
                </select>
                <select
                  name="endDateYear"
                  value={formData.endDate.split('-')[0] || ''}
                  onChange={handleChange}
                  className="w-1/2 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">...</option>
                  {/* Add year options here */}
                </select>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Quá trình học vấn</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="(Tùy chọn) Mô tả quá trình học vấn"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm;