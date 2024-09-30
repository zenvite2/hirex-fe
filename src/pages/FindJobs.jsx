import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars, BsSearch } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

import { experience, jobTypes, jobs } from "../utils/data";
import { CustomButton, JobCard } from "../components";

const FindJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobField, setJobField] = useState("");

  const filterOptions = [
    { label: "Ngành nghề", icon: BiBriefcaseAlt2 },
    { label: "Cấp bậc", icon: BsStars },
    { label: "Kinh nghiệm", icon: BiBriefcaseAlt2 },
    { label: "Mức lương", icon: BiBriefcaseAlt2 },
    { label: "Học vấn", icon: BsStars },
    { label: "Loại công việc", icon: BiBriefcaseAlt2 },
    { label: "Đăng trong", icon: BiBriefcaseAlt2 },
  ];

  return (
    <div className="bg-[#f7fdfd]">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
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
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tất cả ngành nghề"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={jobField}
                  onChange={(e) => setJobField(e.target.value)}
                />
                <BiBriefcaseAlt2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <button className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 text-sm overflow-x-auto">
            {filterOptions.map((option, index) => (
              <div key={index} className="flex items-center cursor-pointer hover:text-green-600 whitespace-nowrap px-3">
                <option.icon className="mr-2" />
                {option.label}
                <MdOutlineKeyboardArrowDown className="ml-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-base mb-6">
          Showing: <span className="font-semibold">1,902</span> Jobs Available
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CustomButton
            title="Load More"
            containerStyles="text-green-600 py-1.5 px-5 focus:outline-none hover:bg-green-600 hover:text-white rounded-full text-base border border-green-600"
          />
        </div>
      </div>
    </div>
  );
};

export default FindJobs;