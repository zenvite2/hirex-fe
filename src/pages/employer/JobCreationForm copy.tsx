import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import {  contracTypeList } from '../../services/autofillApi';
import { jobCreate, jobUpdate, jobGet } from '../../services/jobApi';
import { useLocationSelector } from './useLocationSelector';
import { toast } from 'react-toastify';

interface FormData {
  id: number | null;
  title: string;
  city: number | null;
  district: number | null;
  location: string;
  detail: string;
  industry: number | null;
  yearExperience: number | null;
  jobType: string;
  position: number | null;
  deadline: string;
  salary: number | null;
  contractType: string;
}

const initialFormData: FormData = {
  id: null,
  title: '',
  city: null,
  district: null,
  location: '',
  detail: '',
  industry: null,
  yearExperience: null,
  jobType: '',
  position: null,
  deadline: '',
  salary: null,
  contractType: null,
};

const JobCreationForm: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const {
    city,
    district,
  } = useLocationSelector();


  useEffect(() => {
    const fetchJobData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const result = await dispatch(jobGet(id));
          if (result?.payload?.response?.success) {
            setFormData({
              id: result.payload.response.data.id,
              title: result.payload.response.data.title,
              city: result.payload.response.data.city,
              district: result.payload.response.data.district,
              location: result.payload.response.data.location,
              detail: result.payload.response.data.description,
              industry: result.payload.response.data.industry,
              yearExperience: result.payload.response.data.yearExperience,
              jobType: result.payload.response.data.jobType,
              position: result.payload.response.data.position,
              deadline: result.payload.response.data.deadline,
              salary: result.payload.response.data.salary,
              contractType: result.payload.response.data.contractType
            });
          }
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [dispatch, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const jobData = {
      id: formData.id,
      title: formData.title,
      city: city?.id,
      district: district?.id,
      location: formData.location,
      detail: formData.detail,
      industry: formData.industry,
      yearExperience: formData.yearExperience,
      jobType: formData.jobType,
      position: formData.position,
      deadline: formData.deadline,
      salary: formData.salary,
      contractType: formData.contractType,
    };

    try {
      if (formData.id) {
        await dispatch(jobUpdate(jobData));
        toast.success('Cập nhật job thành công!');
      } else {
        await dispatch(jobCreate(jobData));
        toast.success('Tạo job thành công!');
      }
      navigate('/job-posts');
    } catch (error: any) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const parseDetail = (detail: string) => {
    const lines = detail.split('\n'); // Tách từng dòng
    const result: Record<string, string> = {};

    let currentKey: string | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Nếu dòng bắt đầu bằng "Mô tả công việc" thì xác định là key
        if (trimmedLine === 'Mô tả công việc' || trimmedLine === 'Yêu cầu ứng viên') {
            currentKey = trimmedLine;
            result[currentKey] = '';
        } else if (currentKey) {
            // Nếu đã xác định key thì thêm nội dung vào
            result[currentKey] += trimmedLine + ' ';
        }
    }

    // Trả về kết quả
    return result;
};

  const renderField = (name: keyof FormData, label: string, type: string = 'text') => (
    <div className="relative space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div>
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            className="block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">Chọn {label}</option>
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            className="block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            rows={4}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            className="block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-bold mb-6">
          {formData.id ? 'Chỉnh sửa job' : 'Thêm mới job'}
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {renderField('detail', 'Mô tả', 'textarea')}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className={`px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                {formData.id ? 'Cập nhật' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobCreationForm;