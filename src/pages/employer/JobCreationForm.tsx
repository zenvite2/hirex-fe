import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import { experienceList, positionList, jobTypeList, industryList, contracTypeList, educationList } from '../../services/autofillApi';
import { jobCreate, jobUpdate, jobGetWith, jobGet } from '../../services/jobApi';
import { useLocationSelector } from './useLocationSelector';
import { LocationSelector } from '../../components/registration/LocationSelector';
import { toast } from 'react-toastify';

interface ExperienceType {
  id: number;
  name: string;
  minYear: number;
  maxYear: number;
}

interface PositionType {
  id: number;
  name: string;
}

interface BasicType {
  id: number;
  name: string;
}

interface IndustryType {
  id: number;
  name: string;
}

interface contractType {
  id: number;
  name: string;
}

interface Education {
  id: number;
  name: string;
}

interface FormData {
  id: number | null;
  title: string;
  city: number | null;
  district: number | null;
  location: string;
  description: string;
  industry: number | null;
  yearExperience: number | null;
  jobType: number | null;
  contractType: number | null;
  position: number | null;
  deadline: string;
  minSalary: number | null;
  maxSalary: number | null;
  education: number | null;
  email: string;
  phone: string;
  requirement: string;
  benefit: string;
  workingTime: string;
}

const initialFormData: FormData = {
  id: null,
  title: '',
  description: '',
  location: '',
  requirement: '',
  yearExperience: null,
  minSalary: null,
  maxSalary: null,
  city: null,
  district: null,
  industry: null,
  jobType: null,
  contractType: null,
  position: null,
  deadline: '',
  education: null,
  email: '',
  phone: '',
  benefit: '',
  workingTime: '',
};

const JobCreationForm: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [positions, setPositions] = useState<PositionType[]>([]);
  const [jobTypes, setJobTypes] = useState<BasicType[]>([]);
  const [industrys, setIndustry] = useState<IndustryType[]>([]);
  const [salarys, setSalarys] = useState<IndustryType[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [contractType, setContractType] = useState<contractType[]>([]);

  const {
    city,
    district,
    cities,
    districts,
    handleSelectCity,
    handleSelectDistrict,
    fetchCities,
    fetchDistricts,
  } = useLocationSelector();

  // Utility functions for text formatting
  const normalizeTextAreaContent = (content: string): string => {
    if (!content) return '';
    return content.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  };

  const denormalizeTextAreaContent = (content: string): string => {
    if (!content) return '';
    return content.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experienceResult, positionResult, jobTypeResult, industryResult, educationResult, contractTypeResult] = await Promise.all([
          dispatch(experienceList()).unwrap(),
          dispatch(positionList()).unwrap(),
          dispatch(jobTypeList()).unwrap(),
          dispatch(industryList()).unwrap(),
          dispatch(educationList()).unwrap(),
          dispatch(contracTypeList()).unwrap(),
        ]);

        if (experienceResult.response?.data) {
          setExperiences(experienceResult.response.data);
        }
        if (positionResult.response?.data) {
          setPositions(positionResult.response.data);
        }
        if (jobTypeResult.response?.data) {
          setJobTypes(jobTypeResult.response.data);
        }
        if (industryResult.response?.data) {
          setIndustry(industryResult.response.data);
        }
        if (educationResult.response?.data) {
          setEducation(educationResult.response.data);
        }
        if (contractTypeResult.response?.data) {
          setContractType(contractTypeResult.response.data);
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    };

    fetchData();
  }, [dispatch]);

  // Fetch job data if editing
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (id) {
          const result = await dispatch(jobGet(id));
          if (result?.payload?.response?.success) {
            const jobData = result.payload.response.data;
            // If city exists, fetch districts
            if (jobData.city) {
              await fetchDistricts('', jobData.city);
            }

            setFormData({
              ...jobData,
              description: denormalizeTextAreaContent(jobData.description),
              requirement: denormalizeTextAreaContent(jobData.requirement),
              benefit: denormalizeTextAreaContent(jobData.benefit),
              workingTime: denormalizeTextAreaContent(jobData.workingTime),
            });

          }
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
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

    // Validate mức lương
    if (formData.minSalary !== null && formData.maxSalary !== null) {
      if (formData.minSalary > formData.maxSalary) {
        toast.error('Vui lòng nhập mức lương min nhỏ hơn mức lương max');
        return; // Dừng quá trình submit
      }
    }

    const normalizedData = {
      ...formData,
      description: normalizeTextAreaContent(formData.description),
      requirement: normalizeTextAreaContent(formData.requirement),
      benefit: normalizeTextAreaContent(formData.benefit),
      workingTime: normalizeTextAreaContent(formData.workingTime),
      city: city?.id,
      district: district?.id,
    };

    try {
      if (formData.id) {
        await dispatch(jobUpdate({ id: formData.id, info: normalizedData }));
        toast.success('Cập nhật job thành công!');
      } else {
        await dispatch(jobCreate(normalizedData));
        toast.success('Tạo job thành công!');
      }
      navigate('/job-posts');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const renderSelectOptions = (fieldName: keyof FormData) => {
    switch (fieldName) {
      case 'yearExperience':
        return experiences.map(exp => (
          <option key={exp.id} value={exp.id}>
            {exp.name}
          </option>
        ));
      case 'position':
        return positions.map(pos => (
          <option key={pos.id} value={pos.id}>
            {pos.name}
          </option>
        ));
      case 'jobType':
        return jobTypes.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ));
      case 'industry':
        return industrys.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ));
      case 'minSalary':
      case 'maxSalary':
        return salarys.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ));
      case 'education':
        return education.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ));
      case 'contractType':
        return contractType.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ));
      default:
        return [];
    }
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
            {renderSelectOptions(name)}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            className="block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm whitespace-pre-wrap"
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
            {renderField('title', 'Tiêu đề')}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LocationSelector
                label="Tỉnh / TP"
                placeholder="Chọn tỉnh thành"
                locations={cities}
                value={city?.name || ''}
                onChange={(selectedCity) => {
                  handleSelectCity(selectedCity);
                  setFormData(prev => ({
                    ...prev,
                    city: selectedCity?.id || null,
                    district: null
                  }));
                }}
                onSearch={fetchCities}
                disabled={false}
              />

              <LocationSelector
                label="Quận / Huyện"
                placeholder="Chọn quận huyện"
                locations={districts}
                value={district?.name || ''}
                onChange={(selectedDistrict) => {
                  handleSelectDistrict(selectedDistrict);
                  setFormData(prev => ({
                    ...prev,
                    district: selectedDistrict?.id || null
                  }));
                }}
                onSearch={(query) => fetchDistricts(query, city?.id || 0)}
                disabled={!city}
              />
            </div>

            {renderField('location', 'Địa chỉ cụ thể')}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('industry', 'Ngành nghề', 'select')}
              {renderField('yearExperience', 'Kinh nghiệm làm việc', 'select')}
              {renderField('jobType', 'Loại hình làm việc', 'select')}
              {renderField('position', 'Vị trí', 'select')}
              {renderField('deadline', 'Hạn nộp hồ sơ', 'date')}
              {renderField('contractType', 'Loại công việc', 'select')}
              {renderField('education', 'Học vấn', 'select')}
              {renderField('email', 'Email', 'email')}
              {renderField('minSalary', 'Mức lương min', 'tel')}
              {renderField('maxSalary', 'Mức lương max', 'tel')}
            </div>

            {renderField('description', 'Mô tả công việc', 'textarea')}
            {renderField('requirement', 'Trách nhiệm công việc', 'textarea')}
            {renderField('benefit', 'Quyền lợi', 'textarea')}
            {renderField('workingTime', 'Thời gian làm việc', 'textarea')}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    transition-colors hover:bg-blue-700"
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