import React from 'react';
import { MapPin, Users, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react';

interface CompanyInfo {
  name: string;
  logo: string;
  teamImage: string;
  factoryImage: string;
  description: string;
  address: string;
  employeeCount: string;
  socialLinks: {
    facebook: string;
    linkedin: string;
    youtube: string;
    twitter: string;
  };
  jobs: Array<{
    title: string;
    location: string;
    department: string;
    updatedAt: string;
  }>;
}

const CompanyDetail = () => {
  const company: CompanyInfo = {
    name: "CÔNG TY TNHH DAEYEONG VINA",
    logo: "/api/placeholder/150/150",
    teamImage: "/api/placeholder/800/400",
    factoryImage: "/api/placeholder/400/300",
    description: "Công ty với 100% vốn đầu tư của Hàn Quốc chuyên sản xuất các linh kiện điện tử cho máy giặt và tủ lạnh",
    address: "Lô 406, Đường 13, KCN Amata, phường Long Bình, Biên Hòa, Thành phố Biên Hòa, Đồng Nai",
    employeeCount: "100 - 499 nhân viên",
    socialLinks: {
      facebook: "#",
      linkedin: "#",
      youtube: "#",
      twitter: "#"
    },
    jobs: [
      {
        title: "HR Senior Specialist / Chuyên Viên Nhân Sự Cao Cấp",
        location: "Đồng Nai",
        department: "Trưởng nhóm / Giám sát",
        updatedAt: "3 giờ trước"
      },
      {
        title: "ACCOUNTANT SPECIALIST / CHUYÊN VIÊN KẾ TOÁN",
        location: "Đồng Nai",
        department: "Trưởng nhóm / Giám sát",
        updatedAt: "3 giờ trước"
      },
      {
        title: "NHÂN VIÊN EHS HIỆN TRƯỜNG",
        location: "Đồng Nai",
        department: "Nhân viên",
        updatedAt: "3 giờ trước"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6"> {/* Added consistent padding to container */}
        {/* Banner Image Section */}
        <div className="relative w-full h-40 bg-gradient-to-r from-cyan-700 to-blue-900">
          <div className="absolute inset-0 overflow-hidden">
            {/* Left side - Team Image */}
            <div className="absolute left-0 w-3/4 h-full">
              <img
                src={company.teamImage}
                alt="Team"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right side - Factory Image in Hexagon */}
            <div className="absolute right-0 w-1/4 h-full">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 overflow-hidden" style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
              }}>
                <img
                  src={company.factoryImage}
                  alt="Factory"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Overlay with brand gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-700/60 to-blue-900/60" />

          {/* Company Logo on the far right */}
          <div className="absolute top-4 right-0">
            <div className="flex justify-end">
              <img src="/api/placeholder/150/50" alt="Daeyeong Vina" className="h-8 object-contain" />
            </div>
          </div>
        </div>

        {/* Company Info Bar */}
        <div className="relative bg-white shadow-md">
          <div className="px-6 py-3 flex items-center">
            {/* Company Logo */}
            <div className="w-24 h-24 bg-white rounded-lg shadow-lg -mt-12 flex items-center justify-center p-2">
              <img
                src={company.logo}
                alt="Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Company Details */}
            <div className="ml-6 flex-grow">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{company.address}</span>
              </div>
            </div>

            {/* Employee Count */}
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{company.employeeCount}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* About Company Card */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">Về công ty</h2>
                  <p className="mt-4 text-gray-600">{company.description}</p>
                  <div className="mt-6 rounded-lg overflow-hidden">
                  </div>
                </div>
              </div>

              {/* Jobs Card */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">Việc đang tuyển</h2>
                  <div className="mt-4 space-y-4">
                    {company.jobs.map((job, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                        <h3 className="text-lg font-semibold text-blue-600">{job.title}</h3>
                        <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.department}</span>
                          <span className="ml-auto">Cập nhật: {job.updatedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Social Links Card */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">Theo dõi</h2>
                  <div className="mt-4 flex gap-4">
                    <a href={company.socialLinks.facebook} className="text-blue-600 hover:text-blue-700">
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a href={company.socialLinks.linkedin} className="text-blue-600 hover:text-blue-700">
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a href={company.socialLinks.youtube} className="text-red-600 hover:text-red-700">
                      <Youtube className="w-6 h-6" />
                    </a>
                    <a href={company.socialLinks.twitter} className="text-blue-400 hover:text-blue-500">
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;