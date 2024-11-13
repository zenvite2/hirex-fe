import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaIndustry, FaLevelUpAlt, FaBriefcase, FaDollarSign, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import { JobCard } from '../../components';
import CheckboxDropdown from '../../components/common/CheckboxDropdown';
import { jobSearch } from '../../services/jobApi';
import { experienceList, positionList, jobTypeList, techList, salaryList, contracTypeList } from '../../services/autofillApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useLocationSelector } from '../employer/useLocationSelector';
import { LocationSelector } from './LocationSelector';

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
  const [selectedJobFields, setSelectedJobFields] = useState<string[]>([]);
  const [selectedJobLevels, setSelectedJobLevels] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [selectedEducations, setSelectedEducations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [salaryOptions, setSalaryOptions] = useState<Option[]>([]);
  const [jobTypeOptions, setJobTypeOptions] = useState<Option[]>([]);
  const [experienceOptions, setExperienceOptions] = useState<Option[]>([]);
  const [positionOptions, setPositionOptions] = useState<Option[]>([]);
  const [techOptions, setTechOptions] = useState<Option[]>([]);
  const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([]);

  const {
    city,
    cities,
    isLoadingCities,
    handleSelectCity,
    fetchCities,
  } = useLocationSelector();

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       const result = await dispatch(jobGetWithCompany()).unwrap();
  //       if (result && result.response && result.response.success) {
  //         setJobs(result.response.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching jobs:', error);
  //     }
  //   };

  //   fetchJobs();
  // }, [dispatch]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await dispatch(jobSearch({
          searchQuery,
          city: city?.id,
          techIds: selectedJobFields.map(Number),
          positionIds: selectedJobLevels.map(Number),
          experienceIds: selectedExperiences.map(Number),
          salaryIds: selectedSalaries.map(Number),
          educationIds: selectedEducations.map(Number),
          jobTypeIds: selectedJobTypes.map(Number),
          // contractTypeIds: selectedContractTypes.map(Number),
        })).unwrap();
        if (result && result.response && result.response.success) {
          setJobs(result.response.data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [
    dispatch,
    searchQuery,
    city?.id,
    selectedJobFields,
    selectedJobLevels,
    selectedExperiences,
    selectedSalaries,
    selectedEducations,
    selectedJobTypes,
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

  // Helper function to render the dropdowns
  const renderDropdown = (
    icon: React.ElementType,
    title: string,
    options: Option[],
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
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

  return (
    <div className="bg-[#f7fdfd]">
      <div className="bg-white shadow-md">
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
                placeholder="Nhập tỉnh/thành phố"
                locations={cities}
                value={city ? city.name : ''}
                onChange={handleSelectCity}
                onSearch={fetchCities}
                disabled={isLoadingCities}
              />
            </div>

            <button className="w-full md:w-auto px-6 py-2 bg-[#0069DB] text-white rounded-lg hover:bg-[#004bb5] transition duration-300">
              Tìm kiếm
            </button>

          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
            {renderDropdown(FaIndustry, 'Công nghệ', techOptions, selectedJobFields, setSelectedJobFields, openDropdown, setOpenDropdown)}
            {renderDropdown(FaLevelUpAlt, 'Cấp bậc', positionOptions, selectedJobLevels, setSelectedJobLevels, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, 'Kinh nghiệm', experienceOptions, selectedExperiences, setSelectedExperiences, openDropdown, setOpenDropdown)}
            {renderDropdown(FaDollarSign, 'Mức lương', salaryOptions, selectedSalaries, setSelectedSalaries, openDropdown, setOpenDropdown)}
            {renderDropdown(FaGraduationCap, 'Học vấn', [], selectedEducations, setSelectedEducations, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, 'Loại công việc', jobTypeOptions, selectedJobTypes, setSelectedJobTypes, openDropdown, setOpenDropdown)}
            {/* {renderDropdown(FaCalendarAlt, 'Đăng trong', [], selectedPostingDates, setSelectedPostingDates, openDropdown, setOpenDropdown)} */}
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