  import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import useAppDispatch from '../../hooks/useAppDispatch';
  import { experienceList, positionList, jobTypeList, techList, salaryList, contracTypeList } from '../../services/autofillApi';
  import { jobCreate, jobUpdate, jobGetWith } from '../../services/jobApi';
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

  interface ContractType {
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
    tech: number | null;
    yearExperience: number | null;
    jobType: number | null;
    position: number | null;
    deadline: string;
    salary: number | null;
    contractType: number | null;
    email: string;
    phone: string;
  }

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
    phone: ''
  };

  const JobCreationForm: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const [positions, setPositions] = useState<PositionType[]>([]);
    const [jobTypes, setJobTypes] = useState<BasicType[]>([]);
    const [techs, setTechs] = useState<TechType[]>([]);
    const [salarys, setSalarys] = useState<TechType[]>([]);
    const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
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
          const [experienceResult, positionResult, jobTypeResult, techResult, salaryResult, contractResult] = await Promise.all([
            dispatch(experienceList()).unwrap(),
            dispatch(positionList()).unwrap(),
            dispatch(jobTypeList()).unwrap(),
            dispatch(techList()).unwrap(),
            dispatch(salaryList()).unwrap(),
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
          if (techResult.response?.data) {
            setTechs(techResult.response.data);
          }
          if (salaryResult.response?.data) {
            setSalarys(salaryResult.response.data);
          }
          if (contractResult.response?.data) {
            setContractTypes(contractResult.response.data);
          }
        } catch (error) {
          toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        }
      };

      fetchData();
    }, [dispatch]);

    useEffect(() => {
      const fetchJobData = async () => {
        setIsLoading(true);
        try {
          if (id) {
            const result = await dispatch(jobGetWith(id));
            if (result?.payload?.response?.success) {
              setFormData({
                id: result.payload.response.data.id,
                title: result.payload.response.data.title,
                city: result.payload.response.data.city,
                district: result.payload.response.data.district,
                location: result.payload.response.data.location,
                description: result.payload.response.data.description,
                tech: result.payload.response.data.tech,
                yearExperience: result.payload.response.data.yearExperience,
                jobType: result.payload.response.data.jobType,
                position: result.payload.response.data.position,
                deadline: result.payload.response.data.deadline,
                salary: result.payload.response.data.salary,
                contractType: result.payload.response.data.contractType,
                email: result.payload.response.data.email,
                phone: result.payload.response.data.phone
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
          title: formData.title,
          city: city?.id,
          district: district?.id,
          location: formData.location,
          description: formData.description,
          tech: formData.tech,
          yearExperience: formData.yearExperience,
          jobType: formData.jobType,
          position: formData.position,
          deadline: formData.deadline,
          salary: formData.salary,
          contractType: formData.contractType,
          email: formData.email,
          phone: formData.phone
      };
  
      if (formData.id) {
          await dispatch(jobUpdate({ id: formData.id, info: jobData }));
          toast.success('Cập nhật job thành công!');
      } else {
          await dispatch(jobCreate(jobData));
          toast.success('Tạo job thành công!');
      }
      navigate('/job-posts');
  }


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
        case 'tech':
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
        case 'contractType':
          return contractTypes.map(type => (
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
              {renderField('description', 'Mô tả', 'textarea')}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('tech', 'Công nghệ', 'select')}
                {renderField('yearExperience', 'Kinh nghiệm làm việc', 'select')}
                {renderField('jobType', 'Loại hình làm việc', 'select')}
                {renderField('position', 'Cấp bậc', 'select')}
                {renderField('deadline', 'Hạn nộp hồ sơ', 'date')}
                {renderField('salary', 'Mức lương', 'select')}
                {renderField('contractType', 'Hợp đồng làm việc', 'select')}
                {renderField('email', 'Email', 'email')}
                {renderField('phone', 'Số điện thoại', 'tel')}
              </div>

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