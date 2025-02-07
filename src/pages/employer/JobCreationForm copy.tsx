import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { jobCreate, jobUpdate, jobGet } from '../../services/jobApi';
import { skillList } from '../../services/autofillApi';
import { toast } from 'react-toastify';

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
  skills: number[]; // Add skills as array of ids
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
  skills: [], // Initialize as empty array
};

const JobCreationForm: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Skill selection state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Utility functions for text formatting
  const normalizeTextAreaContent = (content: string): string => {
    if (!content) return '';
    return content.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  };

  const denormalizeTextAreaContent = (content: string): string => {
    if (!content) return '';
    return content.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  };

  // Fetch skills for dropdown
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
              skills: jobData.skills?.map((skill: Skill) => skill.id).filter((id: number) => id !== undefined) || []
            });

            // Set selected skills if available
            if (jobData.skills) {
              setSelectedSkills(jobData.skills);
            }
          }
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    };

    fetchJobData();
  }, [dispatch, id]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate mức lương
    if (formData.minSalary !== null && formData.maxSalary !== null) {
      if (formData.minSalary > formData.maxSalary) {
        toast.error('Vui lòng nhập mức lương min nhỏ hơn mức lương max');
        return;
      }
    }

    const normalizedData = {
      ...formData,
      description: normalizeTextAreaContent(formData.description),
      requirement: normalizeTextAreaContent(formData.requirement),
      benefit: normalizeTextAreaContent(formData.benefit),
      workingTime: normalizeTextAreaContent(formData.workingTime),
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-bold mb-6">
          {formData.id ? 'Chỉnh sửa job' : 'Thêm mới job'}
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Other form fields */}
              
              {/* Skills Selection */}
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