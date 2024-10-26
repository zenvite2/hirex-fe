import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import { experienceList, positionList, jobTypeList, techList, salaryList } from '../../services/autofillApi';
import { jobCreate, jobUpdate} from '../../services/jobApi';
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

interface TechType {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  city: number | null;
  district: number | null;
  location: string;
  description: string;
  industry: number | null;
  yearExperience: number | null;
  jobType: string;
  position: number | null;
  deadline: string;
  salary: number | null;
  overtime: string;
  email: string;
  phone: string;
}

const initialFormData: FormData = {
  title: '',
  city: null,
  district: null,
  location: '',
  description: '',
  industry: null,
  yearExperience: null,
  jobType: '',
  position: null,
  deadline: '',
  salary: null,
  overtime: '',
  email: '',
  phone: ''
};

const JobCreationForm: React.FC = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [positions, setPositions] = useState<PositionType[]>([]);
  const [jobTypes, setJobTypes] = useState<BasicType[]>([]);
  const [techs, setTechs] = useState<TechType[]>([]);
  const [salarys, setSalarys] = useState<TechType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experienceResult, positionResult, jobTypeResult, techResult, salaryResult] = await Promise.all([
          dispatch(experienceList()).unwrap(),
          dispatch(positionList()).unwrap(),
          dispatch(jobTypeList()).unwrap(),
          dispatch(techList()).unwrap(),
          dispatch(salaryList()).unwrap(),
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
        if (techResult.response?.data) {
          setTechs(techResult.response.data);
        }
        if (salaryResult.response?.data) {
          setSalarys(salaryResult.response.data);
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    };

    fetchData();
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const jobData = {
      ...formData,
      city: city?.id,
      district: district?.id,
    };

    setIsSubmitting(true);
    try {
      const result = await dispatch(jobCreate(jobData));
      if (result?.payload?.response?.success == true) {
        toast.success('Tạo job thành công!');
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi tạo job. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
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
        return techs.map(type => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ));
      case 'salary':
        return salarys.map(type => (
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
        <h1 className="text-3xl font-bold mb-6">Thêm mới job</h1>

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
            {renderField('description', 'Mô tả', 'textarea')}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('industry', 'Công nghệ', 'select')}
              {renderField('yearExperience', 'Kinh nghiệm làm việc', 'select')}
              {renderField('jobType', 'Loại hình làm việc', 'select')}
              {renderField('position', 'Cấp bậc', 'select')}
              {renderField('deadline', 'Hạn nộp hồ sơ', 'date')}
              {renderField('salary', 'Mức lương', 'select')}
              {renderField('overtime', 'Làm thêm giờ (OT)', 'select')}
              {renderField('email', 'Email', 'email')}
              {renderField('phone', 'Số điện thoại', 'tel')}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg 
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobCreationForm;