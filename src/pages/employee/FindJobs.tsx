import React, { useState, useEffect, useCallback } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaIndustry, FaLevelUpAlt, FaBriefcase, FaDollarSign, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import { JobCard } from '../../components';
import CheckboxDropdown from '../../components/common/CheckboxDropdown';
import { jobSearch, recommendJob } from '../../services/jobApi';
import { experienceList, positionList, jobTypeList, industryList, salaryList, contracTypeList, educationList } from '../../services/autofillApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useLocationSelector } from '../employer/useLocationSelector';
import { LocationSelector } from './LocationSelector';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Pagination from './Pagination';

interface Option {
  id: number;
  name: string;
  value?: any;
}

export interface Job {
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
  description: string | null;
  jobType: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  contractType: string;
}

export const salaryOptions: Option[] = [
  {
    name: "Dưới 5 triệu",
    id: 1,
    value: {
      minSalary: 0,
      maxSalary: 5000000 - 1
    }
  },
  {
    name: "Từ 5-10 triệu",
    id: 2,
    value: {
      minSalary: 5000000,
      maxSalary: 10000000 - 1
    }
  },
  {
    name: "Từ 10-20 triệu",
    id: 3,
    value: {
      minSalary: 10000000,
      maxSalary: 20000000 - 1
    }
  },
  {
    name: "Trên 20 triệu",
    id: 4,
    value: {
      minSalary: 20000000,
    }
  }
];

const FindJobs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.authReducer);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendJobs, setRecommendJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobFieldIds, setSelectedJobFieldIds] = useState<number[]>([]);
  const [selectedJobLevelIds, setSelectedJobLevelIds] = useState<number[]>([]);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<number[]>([]);
  const [selectedSalaryIds, setSelectedSalaryIds] = useState<number[]>([]);
  const [selectedEducationIds, setSelectedEducationIds] = useState<number[]>([]);
  const [selectedJobTypeIds, setSelectedJobTypeIds] = useState<number[]>([]);
  const [selectedContractTypeIds, setSelectedContractTypeIds] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [industryOptions, setIndustryOptions] = useState<Option[]>([]);
  const [positionOptions, setPositionOptions] = useState<Option[]>([]);
  const [experienceOptions, setExperienceOptions] = useState<Option[]>([]);
  const [jobTypeOptions, setJobTypeOptions] = useState<Option[]>([]);
  const [educationOptions, setEducationOptions] = useState<Option[]>([]);
  const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([]);

  const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-indexed pages
  const [pageSize, setPageSize] = useState(2); // Default page size
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const {
    city,
    cities,
    handleSelectCity,
    fetchCities,
  } = useLocationSelector();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        dispatch(startLoading());
        const result = await dispatch(jobSearch({
          searchQuery,
          page: currentPage,
          size: pageSize,
          ...(city?.id ? { city: city.id } : {}),
          industryIds: selectedJobFieldIds,
          positionIds: selectedJobLevelIds,
          experienceIds: selectedExperienceIds,
          salaryOptionsId: selectedSalaryIds,
          educationIds: selectedEducationIds,
          jobTypeIds: selectedJobTypeIds,
          contractTypeIds: selectedContractTypeIds
        })).unwrap();
        if (result && result.response && result.response.success) {
          setJobs(result.response.data);
          setTotalPages(result.response.metaData.totalPages);
          setTotalItems(result.response.metaData.totalItems);
          setCurrentPage(result.response.metaData.currentPage);
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
    selectedContractTypeIds,
    currentPage,
    pageSize
  ]);

  const getRecommendJobs = useCallback(async () => {
    const lstJobs = await recommendJob(userId);
    lstJobs && setRecommendJobs(lstJobs);
  }, [userId]);

  useEffect(() => {
    isLoggedIn && getRecommendJobs();
  }, [isLoggedIn])

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [experienceResult, positionResult, jobTypeResult, industryResult, contractResult, educationResult] = await Promise.all([
          dispatch(experienceList()).unwrap(),
          dispatch(positionList()).unwrap(),
          dispatch(jobTypeList()).unwrap(),
          dispatch(industryList()).unwrap(),
          dispatch(contracTypeList()).unwrap(),
          dispatch(educationList()).unwrap(),
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

        if (industryResult?.response?.data) {
          setIndustryOptions(industryResult.response.data);
        }

        if (contractResult?.response?.data) {
          setContractTypeOptions(contractResult.response.data);
        }

        if (educationResult?.response?.data) {
          setEducationOptions(educationResult.response.data);
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
        page: currentPage,
        size: pageSize,
        industryIds: selectedJobFieldIds,
        positionIds: selectedJobLevelIds,
        experienceIds: selectedExperienceIds,
        salaryOptionsId: selectedSalaryIds,
        educationIds: selectedEducationIds,
        jobTypeIds: selectedJobTypeIds,
        contractTypeIds: selectedContractTypeIds,
      })).unwrap();
      if (result && result.response && result.response.success) {
        setJobs(result.response.data);

        if (result.response.metaData) {
          setTotalPages(result.response.metaData.totalPages);
          setTotalItems(result.response.metaData.totalItems);
          setCurrentPage(result.response.metaData.currentPage);

          console.log(result.response.metaData.totalPages)
        }

      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            {renderDropdown(FaIndustry, 'Ngành nghề', industryOptions, selectedJobFieldIds, setSelectedJobFieldIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaLevelUpAlt, 'Vị trí', positionOptions, selectedJobLevelIds, setSelectedJobLevelIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, 'Kinh nghiệm', experienceOptions, selectedExperienceIds, setSelectedExperienceIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaDollarSign, 'Mức lương', salaryOptions, selectedSalaryIds, setSelectedSalaryIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaGraduationCap, 'Học vấn', educationOptions, selectedEducationIds, setSelectedEducationIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, 'Làm việc', jobTypeOptions, selectedJobTypeIds, setSelectedJobTypeIds, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, 'Loại công việc', contractTypeOptions, selectedContractTypeIds, setSelectedContractTypeIds, openDropdown, setOpenDropdown)}
          </div>
        </div>
      </div>

      {/* Job List */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sticky top-0 border-gray-200 py-4">
          <h2 className="text-3xl font-bold text-gray-600 max-w-7xl mx-auto px-2">
            Khám phá
          </h2>
          <p className="text-base mb-4 mt-2 text-gray-500 px-2">
            <span className="font-semibold">{jobs.length}</span> công việc đang có sẵn
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center mb-10">
          {jobs.map((job, index) => (
            <div key={index} className="w-full max-w-sm">
              <JobCard job={{ ...job, id: job.id }} />
            </div>
          ))}
        </div>
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        {isLoggedIn && recommendJobs.length > 0 && <>
          <div className="sticky top-0 border-t-2 border-gray-200 py-4 mt-6">
            <h2 className="text-2xl font-bold text-gray-600 max-w-7xl mx-auto px-2">
              Gợi ý cho bạn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {recommendJobs.map((job, index) => (
              <div key={index} className="w-full max-w-sm">
                <JobCard job={{ ...job, id: job.id }} />
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
};

export default FindJobs;