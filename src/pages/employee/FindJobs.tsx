import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaIndustry, FaLevelUpAlt, FaBriefcase, FaDollarSign, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import { JobCard } from '../../components';
import CheckboxDropdown from '../../components/common/CheckboxDropdown';
import { jobSearch } from '../../services/jobApi';
import { experienceList, positionList, jobTypeList, techList, salaryList, contracTypeList } from '../../services/autofillApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useLocationSelector } from '../employer/useLocationSelector';
import { LocationSelector } from './LocationSelector';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

interface Option {
  id: number;
  name: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  district: string;
  city: string;
  deadline: string;
  createdAt: string;
  companyName: string;
  companyLogo: string | null;
  companyDescription: string | null;
  jobType: string;
  experience: string;
  salary: string;
}

const FindJobs: React.FC = () => {
  const dispatch = useAppDispatch();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobFieldIds, setSelectedJobFieldIds] = useState<number[]>([]);
  const [selectedJobLevelIds, setSelectedJobLevelIds] = useState<number[]>([]);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<number[]>([]);
  const [selectedSalaryIds, setSelectedSalaryIds] = useState<number[]>([]);
  const [selectedEducationIds, setSelectedEducationIds] = useState<number[]>([]);
  const [selectedJobTypeIds, setSelectedJobTypeIds] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [techOptions, setTechOptions] = useState<Option[]>([]);
  const [positionOptions, setPositionOptions] = useState<Option[]>([]);
  const [experienceOptions, setExperienceOptions] = useState<Option[]>([]);
  const [salaryOptions, setSalaryOptions] = useState<Option[]>([]);
  const [jobTypeOptions, setJobTypeOptions] = useState<Option[]>([]);
  const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([]);

  const {
    city,
    cities,
    isLoadingCities,
    handleSelectCity,
    fetchCities,
  } = useLocationSelector();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        dispatch(startLoading());
        const result = await dispatch(jobSearch({
          searchQuery,
          ...(city?.id ? { city: city.id } : {}),
          techIds: selectedJobFieldIds,
          positionIds: selectedJobLevelIds,
          experienceIds: selectedExperienceIds,
          salaryIds: selectedSalaryIds,
          educationIds: selectedEducationIds,
          jobTypeIds: selectedJobTypeIds,
        })).unwrap();
        if (result && result.response && result.response.success) {
          setJobs(result.response.data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchJobs();
  }, [
    dispatch,
    selectedJobFieldIds,
    selectedJobLevelIds,
    selectedExperienceIds,
    selectedSalaryIds,
    selectedEducationIds,
    selectedJobTypeIds,
  ]);


  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [experienceResult, positionResult, jobTypeResult, techResult, salaryResult, contractResult] = await Promise.all([
          dispatch(experienceList()).unwrap(),
          dispatch(positionList()).unwrap(),
          dispatch(jobTypeList()).unwrap(),
          dispatch(techList()).unwrap(),
          dispatch(salaryList()).unwrap(),
          dispatch(contracTypeList()).unwrap(),
        ]);

        if (experienceResult?.response?.data) {
          setExperienceOptions(experienceResult.response.data);
        }

        if (positionResult?.response?.data) {
          setPositionOptions(positionResult.response.data);
        }

        if (jobTypeResult?.response?.data) {
          setJobTypeOptions(jobTypeResult.response.data);
        }

        if (techResult?.response?.data) {
          setTechOptions(techResult.response.data);
        }

        if (salaryResult?.response?.data) {
          setSalaryOptions(salaryResult.response.data);
        }

        if (contractResult?.response?.data) {
          setContractTypeOptions(contractResult.response.data);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, [dispatch]);

  const renderDropdown = (
    icon: React.ElementType,
    title: string,
    options: Option[],
    selectedValues: number[],
    setSelectedValues: (values: number[]) => void,
    openDropdown: string | null,
    setOpenDropdown: (dropdown: string | null) => void
  ) => (
    <CheckboxDropdown
      icon={icon}
      title={title}
      options={options}
      selectedValues={selectedValues}
      onChange={setSelectedValues}
      isOpen={openDropdown === title}
      onToggle={() => setOpenDropdown(openDropdown === title ? null : title)}
    />
  );

  const handleSearch = async () => {
    try {
      const result = await dispatch(jobSearch({
        searchQuery,
        ...(city?.id ? { city: city.id } : {}),
        techIds: selectedJobFieldIds,
        positionIds: selectedJobLevelIds,
        experienceIds: selectedExperienceIds,
        salaryIds: selectedSalaryIds,
        educationIds: selectedEducationIds,
        jobTypeIds: selectedJobTypeIds
      })).unwrap();
      if (result && result.response && result.response.success) {
        setJobs(result.response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div className="bg-[#f7fdfd]">
      <div
        className="bg-fixed shadow-md"
        style={{
          backgroundImage: 'radial-gradient( circle 311px at 8.6% 27.9%,  rgba(62,147,252,0.57) 12.9%, rgba(239,183,192,0.44) 91.2% )'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          {/* Search and Location inputs */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Vị trí tuyển dụng"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* City Selector */}
            <div className="flex-1 w-full md:w-auto">
              <LocationSelector
                placeholder="Chọn tỉnh thành"
                locations={cities}
                value={city?.name || ''}
                onChange={handleSelectCity}
                onSearch={fetchCities}
                disabled={false}
              />
            </div>

            <button className="w-full md:w-auto px-6 py-2 bg-[#0069DB] text-white rounded-lg hover:bg-[#004bb5] transition duration-300" onClick={handleSearch}>
              Tìm kiếm
            </button>

          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
            {renderDropdown(FaIndustry, 'Công nghệ', techOptions, selectedJobFieldIds, setSelectedJobFieldIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaLevelUpAlt, 'Cấp bậc', positionOptions, selectedJobLevelIds, setSelectedJobLevelIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, 'Kinh nghiệm', experienceOptions, selectedExperienceIds, setSelectedExperienceIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaDollarSign, 'Mức lương', salaryOptions, selectedSalaryIds, setSelectedSalaryIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaGraduationCap, 'Học vấn', [], selectedEducationIds, setSelectedEducationIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, 'Loại công việc', jobTypeOptions, selectedJobTypeIds, setSelectedJobTypeIds, openDropdown, setOpenDropdown)}
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-base mb-6">
          Showing: <span className="font-semibold">{jobs.length}</span> Jobs Available
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {jobs.map((job, index) => (
            <div key={index} className="w-full max-w-sm">
              <JobCard job={{ ...job, id: job.id }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;