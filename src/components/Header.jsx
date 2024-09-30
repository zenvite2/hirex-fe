import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const SearchBar = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', { jobTitle, location, industry });
    // Implement your search logic here
  };

  return (
    <div className="bg-white rounded-full shadow-lg flex flex-wrap items-center p-2 max-w-5xl mx-auto">
      <div className="flex items-center flex-1 min-w-0 px-4 py-2">
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Vị trí tuyển dụng"
          className="w-full outline-none"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center flex-1 min-w-0 px-4 py-2 border-l border-gray-300">
        <FaMapMarkerAlt className="text-gray-400 mr-3" />
        <select
          className="w-full outline-none bg-transparent appearance-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Tất cả tỉnh/thành ...</option>
          <option value="hanoi">Hà Nội</option>
          <option value="hcm">TP. Hồ Chí Minh</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="flex items-center flex-1 min-w-0 px-4 py-2 border-l border-gray-300">
        <FaBriefcase className="text-gray-400 mr-3" />
        <select
          className="w-full outline-none bg-transparent appearance-none"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">Tất cả ngành nghề</option>
          <option value="it">Công nghệ thông tin</option>
          <option value="finance">Tài chính - Ngân hàng</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <button
        onClick={handleSearch}
        className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300"
      >
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchBar;