import React from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';

const JobListings = () => {
  const jobListings = [
    {
      title: 'GIẢNG VIÊN IELTS OFFLINE (THU NHẬP TỪ 460.000 - 700.000VND/BUỔI)',
      location: 'Hà Nội',
      createdAt: '2023-04-16 07:55:40',
      deadline: '2023-12-08',
      status: 'Đã duyệt'
    },
    {
      title: 'NHÂN VIÊN TƯ VẤN KHÓA HỌC PARTIME',
      location: 'Hà Nội',
      createdAt: '2023-04-16 07:53:47',
      deadline: '2023-06-01',
      status: 'Đã duyệt'
    },
    {
      title: 'TRỢ GIẢNG IELTS OFFLINE',
      location: 'Hà Nội',
      createdAt: '2023-04-16 07:52:15',
      deadline: '2023-07-20',
      status: 'Đã duyệt'
    }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách job</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Thêm mới job</button>
      </div>
      
      <div className="bg-gray-100 p-4 mb-4 flex justify-between">
        <div className="flex items-center">
          <span className="mr-2">🕒</span>
          <span className="font-bold mr-1">10</span>
          Tin tuyển dụng
        </div>
        <div className="flex items-center">
          <span className="mr-2">📄</span>
          <span className="font-bold mr-1">10</span>
          Tin đã duyệt
        </div>
        <div className="flex items-center">
          <span className="mr-2">👥</span>
          <span className="font-bold mr-1">3</span>
          Ứng viên
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-pink-500">
            <th>Tiêu đề</th>
            <th>Thời gian tạo / Hạn hs</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {jobListings.map((job, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">
                <div className="font-bold">{job.title}</div>
                <div className="text-gray-500">{job.location}</div>
              </td>
              <td className="py-2">
                <div>{job.createdAt}</div>
                <div>{job.deadline}</div>
              </td>
              <td className="py-2">
                <span className="text-red-500">{job.status}</span>
              </td>
              <td className="py-2">
                <Eye className="inline-block mr-2 text-gray-500" size={18} />
                <Pencil className="inline-block mr-2 text-gray-500" size={18} />
                <Trash className="inline-block text-gray-500" size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobListings;