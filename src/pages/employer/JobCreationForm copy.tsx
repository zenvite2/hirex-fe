import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import { jobCreate, jobUpdate, jobGetWith } from '../../services/jobApi';
import { toast } from 'react-toastify';

interface JobDetails {
  description: string[];
  responsibilities: string[];
}

interface FormData {
  id: number | null;
  title: string;
  city: number | null;
  district: number | null;
  location: string;
  description: string;
  tech: number | null;
  yearExperience: number | null;
  jobType: number | null;
  position: number | null;
  deadline: string;
  salary: number | null;
  contractType: number | null;
  email: string;
  phone: string;
  jobDetails: JobDetails;
}

const initialJobDetails: JobDetails = {
  description: [''],
  responsibilities: [''],
};

const initialFormData: FormData = {
  id: null,
  title: '',
  city: null,
  district: null,
  location: '',
  description: '',
  tech: null,
  yearExperience: null,
  jobType: null,
  position: null,
  deadline: '',
  salary: null,
  contractType: null,
  email: '',
  phone: '',
  jobDetails: initialJobDetails
};

const JobCreationForm: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (id) {
          const result = await dispatch(jobGetWith(id));
          if (result?.payload?.response?.success) {
            const jobData = result.payload.response.data;
            setFormData({
              ...jobData,
              jobDetails: jobData.jobDetails || initialJobDetails
            });
          }
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    };

    fetchJobData();
  }, [dispatch, id]);

  const handleJobDetailsChange = (
    section: 'description' | 'responsibilities' | 'note',
    value: string,
    index?: number
  ) => {
    setFormData(prev => {
      if (section === 'note') {
        return {
          ...prev,
          jobDetails: {
            ...prev.jobDetails,
            note: value
          }
        };
      }

      const newSection = [...prev.jobDetails[section]];
      if (index !== undefined) newSection[index] = value;
      return {
        ...prev,
        jobDetails: {
          ...prev.jobDetails,
          [section]: newSection
        }
      };
    });
  };

  const handleAddField = (section: 'description' | 'responsibilities') => {
    setFormData(prev => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        [section]: [...prev.jobDetails[section], '']
      }
    }));
  };

  const handleRemoveField = (section: 'description' | 'responsibilities', index: number) => {
    setFormData(prev => {
      const newSection = [...prev.jobDetails[section]];
      newSection.splice(index, 1);
      return {
        ...prev,
        jobDetails: {
          ...prev.jobDetails,
          [section]: newSection
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const jobData = {
      ...formData
    };

    if (formData.id) {
      await dispatch(jobUpdate({ id: formData.id, info: jobData }));
      toast.success('Cập nhật job thành công!');
    } else {
      await dispatch(jobCreate(jobData));
      toast.success('Tạo job thành công!');
    }
    navigate('/job-posts');
  };

  const renderDynamicFields = (
    section: 'description' | 'responsibilities',
    title: string,
    placeholder: string
  ) => {
    const values = formData.jobDetails[section];

    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-4">
          {values.map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleJobDetailsChange(section, e.target.value, index)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder={placeholder}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveField(section, index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField(section)}
            className="mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            + Thêm
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-bold mb-6">
          {formData.id ? 'Chỉnh sửa job' : 'Thêm mới job'}
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {renderDynamicFields('description', 'Mô tả công việc', 'Nhập mô tả công việc')}
            {renderDynamicFields('responsibilities', 'Trách nhiệm công việc', 'Nhập trách nhiệm công việc')}
            
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
