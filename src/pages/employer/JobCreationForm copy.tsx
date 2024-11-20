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



  // Fetch job data if editing
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (id) {
          const result = await dispatch(jobGet(id));
          if (result?.payload?.response?.success) {
            const jobData = result.payload.response.data;
            
            // Set form data
            setFormData({
              ...jobData,
            });

            // Set city and district from IDs
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


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-bold mb-6">
          {formData.id ? 'Chỉnh sửa job' : 'Thêm mới job'}
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

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