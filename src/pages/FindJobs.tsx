import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaIndustry, FaLevelUpAlt, FaBriefcase, FaDollarSign, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import { jobs } from "../utils/data";
import { CustomButton, JobCard } from "../components";
import CheckboxDropdown from "../components/CheckboxDropdown";

interface Option {
  value: string;
  label: string;
}

const jobFieldOptions: Option[] = [
  { value: "it", label: "Công nghệ thông tin" },
  { value: "finance", label: "Tài chính - Ngân hàng" },
  // Thêm các ngành nghề khác
];

const jobLevelOptions: Option[] = [
  { value: "intern", label: "Thực tập" },
  { value: "fresher", label: "Mới đi làm" },
  { value: "staff", label: "Nhân viên" },
  { value: "manager", label: "Trưởng phòng / Quản lý" },
  { value: "director", label: "Giám đốc" },
];

const experienceOptions: Option[] = [
  { value: "0-1", label: "Dưới 1 năm" },
  { value: "1-3", label: "1 - 3 năm" },
  { value: "3-5", label: "3 - 5 năm" },
  { value: "5-10", label: "5 - 10 năm" },
  { value: "10+", label: "Trên 10 năm" },
];

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

const FindJobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [jobLocation, setJobLocation] = useState<string>("");
  const [selectedJobFields, setSelectedJobFields] = useState<string[]>([]);
  const [selectedJobLevels, setSelectedJobLevels] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [selectedEducations, setSelectedEducations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedPostingDates, setSelectedPostingDates] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="bg-[#f7fdfd]">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Query Input */}
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

            {/* Job Location Input */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tất cả tỉnh/thành phố"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                />
                <HiOutlineLocationMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
              Tìm kiếm
            </button>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
            {renderDropdown(FaIndustry, "Ngành nghề", jobFieldOptions, selectedJobFields, setSelectedJobFields, openDropdown, setOpenDropdown)}
            {renderDropdown(FaLevelUpAlt, "Cấp bậc", jobLevelOptions, selectedJobLevels, setSelectedJobLevels, openDropdown, setOpenDropdown)}
            {renderDropdown(FaBriefcase, "Kinh nghiệm", experienceOptions, selectedExperiences, setSelectedExperiences, openDropdown, setOpenDropdown)}
            {renderDropdown(FaDollarSign, "Mức lương", [], selectedSalaries, setSelectedSalaries, openDropdown, setOpenDropdown)} {/* Thêm options cho mức lương */}
            {renderDropdown(FaGraduationCap, "Học vấn", [], selectedEducations, setSelectedEducations, openDropdown, setOpenDropdown)} {/* Thêm options cho học vấn */}
            {renderDropdown(FaBriefcase, "Loại công việc", [], selectedJobTypes, setSelectedJobTypes, openDropdown, setOpenDropdown)} {/* Thêm options cho loại công việc */}
            {renderDropdown(FaCalendarAlt, "Đăng trong", [], selectedPostingDates, setSelectedPostingDates, openDropdown, setOpenDropdown)} {/* Thêm options cho thời gian đăng */}
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-base mb-6">
          Showing: <span className="font-semibold">1,902</span> Jobs Available
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {jobs.map((job, index) => (
            <div key={index} className="w-full max-w-sm">
              <JobCard job={{ ...job, id: Number(job.id) }} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CustomButton title="Xem thêm" />
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
