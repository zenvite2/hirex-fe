import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppDispatch from '../../hooks/useAppDispatch';
import { experienceList, positionList, jobTypeList, industryList, contracTypeList, educationList } from '../../services/autofillApi';
import { jobCreate, jobUpdate, jobGetWith, jobGet } from '../../services/jobApi';
import { useLocationSelector } from './useLocationSelector';
import { LocationSelector } from '../../components/registration/LocationSelector';
import { toast } from 'react-toastify';
import { X, ChevronDown } from 'lucide-react';
import { skillList } from '../../services/autofillApi';

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

interface Skill {
  id?: number;
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Skill selection state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSkills = async (name: string) => {
    setIsLoading(true);
    try {
      const result = await dispatch(skillList({ name })).unwrap();
      if (result?.response) {
        setAvailableSkills(result?.response?.data);
      } else {
        setAvailableSkills([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setAvailableSkills([]);
      toast.error('Có lỗi khi tải danh sách kỹ năng');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.city) newErrors.city = 'Tỉnh / Thành phố là bắt buộc';
    if (!formData.district) newErrors.district = 'Quận / Huyện là bắt buộc';
    if (!formData.industry) newErrors.industry = 'Ngành nghề là bắt buộc';
    if (!formData.yearExperience) newErrors.yearExperience = 'Kinh nghiệm làm việc là bắt buộc';
    if (!formData.jobType) newErrors.jobType = 'Loại hình làm việc là bắt buộc';
    if (!formData.position) newErrors.position = 'Vị trí là bắt buộc';
    if (!formData.deadline) newErrors.deadline = 'Hạn nộp hồ sơ là bắt buộc';
    if (!formData.contractType) newErrors.contractType = 'Loại công việc là bắt buộc';
    if (!formData.education) newErrors.education = 'Học vấn là bắt buộc';
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!formData.description.trim()) newErrors.description = 'Mô tả công việc là bắt buộc';
    if (!formData.requirement.trim()) newErrors.requirement = 'Trách nhiệm công việc là bắt buộc';
    if (!formData.benefit.trim()) newErrors.benefit = 'Quyền lợi là bắt buộc';
    if (!formData.workingTime.trim()) newErrors.workingTime = 'Thời gian làm việc là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true nếu không có lỗi
  };


  // Filter out already selected skills
  const filteredSkills = availableSkills.filter(
    skill => !selectedSkills.some(selected => selected.id === skill.id)
  );

  // Add skill handler
  const handleAddSkill = (skill: Skill) => {
    if (!selectedSkills.some(selected => selected.id === skill.id)) {
      const updatedSkills = [...selectedSkills, skill];
      setSelectedSkills(updatedSkills);
      // Update form data with skill ids
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills.map(s => s.id).filter((id): id is number => id !== undefined)
      }));
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Remove skill handler
  const handleRemoveSkill = (skillToRemove: Skill) => {
    const updatedSkills = selectedSkills.filter(s => s.id !== skillToRemove.id);
    setSelectedSkills(updatedSkills);
    // Update form data with skill ids
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills.map(s => s.id).filter((id): id is number => id !== undefined)
    }));
  };

  const {
    city,
    district,
    cities,
    districts,
    handleSelectCity,
    handleSelectDistrict,
    fetchCities,
    fetchDistricts,
    setCityFromId,
    setDistrictFromId
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


            setFormData({
              ...jobData,
              description: denormalizeTextAreaContent(jobData.description),
              requirement: denormalizeTextAreaContent(jobData.requirement),
              benefit: denormalizeTextAreaContent(jobData.benefit),
              workingTime: denormalizeTextAreaContent(jobData.workingTime),
            });

            if (jobData.city) {
              await setCityFromId(jobData.city);
              if (jobData.district) {
                await setDistrictFromId(jobData.district, jobData.city);
              }
            }

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

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại các trường bắt buộc');
      return; // Dừng gửi form nếu có lỗi
    }

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

  // const renderField = (name: keyof FormData, label: string, type: string = 'text') => (
  //   <div className="relative space-y-2">
  //     <label className="block text-sm font-semibold text-gray-700">
  //       {label}
  //     </label>
  //     <div>
  //       {type === 'select' ? (
  //         <select
  //           id={name}
  //           name={name}
  //           value={formData[name] as string}
  //           onChange={handleInputChange}
  //           className="block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
  //         >
  //           <option value="">Chọn {label}</option>
  //           {renderSelectOptions(name)}
  //         </select>
  //       ) : type === 'textarea' ? (
  //         <textarea
  //           id={name}
  //           name={name}
  //           value={formData[name] as string}
  //           onChange={handleInputChange}
  //           className="block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm whitespace-pre-wrap"
  //           rows={4}
  //         />
  //       ) : (
  //         <input
  //           type={type}
  //           id={name}
  //           name={name}
  //           value={formData[name] as string}
  //           onChange={handleInputChange}
  //           className="block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
  //         />
  //       )}
  //     </div>
  //   </div>
  // );

  const renderField = (
    name: keyof FormData,
    label: string,
    type: string = 'text',
    isRequired: boolean = true // Mặc định các trường là bắt buộc
  ) => (
    <div className="relative space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div>
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            className={`block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm 
                        ${errors[name] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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
            className={`block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm whitespace-pre-wrap 
                        ${errors[name] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            rows={4}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            className={`block w-full px-3 py-1.5 text-base border rounded-lg border-gray-300 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm 
                        ${errors[name] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
          />
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
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
                label="Tỉnh / TP *" 
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
                label="Quận / Huyện *"
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
              {renderField('minSalary', 'Mức lương min', 'number')}
              {renderField('maxSalary', 'Mức lương max', 'number')}
            </div>

            {renderField('description', 'Mô tả công việc', 'textarea')}
            {renderField('requirement', 'Trách nhiệm công việc', 'textarea')}
            {renderField('benefit', 'Quyền lợi', 'textarea')}
            {renderField('workingTime', 'Thời gian làm việc', 'textarea')}

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kỹ năng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    fetchSkills(e.target.value);
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    fetchSkills('');
                  }}
                  placeholder="Nhập mới hoặc chọn trong danh sách dưới đây"
                  className="w-full p-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ChevronDown
                  className={`absolute right-2 top-3 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                  size={20}
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    if (!isDropdownOpen) fetchSkills('');
                  }}
                />

                {isDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {isLoading ? (
                      <div className="p-2 text-center text-gray-500">Đang tải...</div>
                    ) : (
                      <>
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill.id ?? skill.name}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50"
                          >
                            {skill.name}
                          </button>
                        ))}
                        {!isLoading && filteredSkills.length === 0 && (
                          <div className="p-2 text-center text-gray-500">
                            Không tìm thấy kỹ năng
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {selectedSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill.id ?? skill.name}
                      className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {skill.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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