import React from 'react';
import { Search, ChevronDown, Download, Trash, CheckCircle, XCircle } from 'lucide-react';

const ApplicantsList = () => {
  const applicants = [
    {
      job: 'CỘNG TÁC VIÊN CONTENT MARKETING (THU NHẬP TỪ 4.000.000 - 6.000.000 VNĐ)',
      name: 'Nguyễn Văn AA',
      phone: '0928817228',
      email: 'nguyenvanaaa@gmail.com',
      location: 'Số 2, Ngõ 54, Phố Vũ Trọng Phụng, Thanh Xuân, Hà Nội',
      date: '2023-04-16 08:30',
      status: 'Pass'
    },
    {
      job: 'NHÂN VIÊN TƯ VẤN KHÓA HỌC PARTIME',
      name: 'Nguyễn Văn AA',
      phone: '0928817228',
      email: 'nguyenvanaaa@gmail.com',
      location: '206 Bạch Mai, Hai Bà Trưng, Hà Nội',
      date: '2023-04-16 08:14',
      status: 'Fail'
    }
  ];

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Tên ứng viên"
          className="border p-2 mr-2 rounded"
        />
        <div className="relative inline-block mr-2">
          <select className="border p-2 pr-8 appearance-none rounded">
            <option>Chọn trạng thái</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Danh sách ứng tuyển</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-pink-500">
            <th>Jop</th>
            <th>Ứng viên</th>
            <th>Ngày ứng tuyển</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">
                <div className="font-bold">{applicant.job}</div>
                <div className="text-gray-500">📍 {applicant.location}</div>
                <div className="text-red-500">Đánh giá</div>
              </td>
              <td className="py-2">
                <div>{applicant.name}</div>
                <div>Phone: {applicant.phone}</div>
                <div>Email: {applicant.email}</div>
                <div className="flex items-center">
                  CV: <Download className="w-4 h-4 ml-1" /> Download
                </div>
              </td>
              <td className="py-2">{applicant.date}</td>
              <td className="py-2">
                <span className={applicant.status === 'Pass' ? 'text-green-500' : 'text-red-500'}>
                  {applicant.status}
                </span>
              </td>
              <td className="py-2">
                <Trash className="inline-block mr-2 text-gray-500" size={18} />
                <CheckCircle className="inline-block mr-2 text-gray-500" size={18} />
                <XCircle className="inline-block text-gray-500" size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsList;