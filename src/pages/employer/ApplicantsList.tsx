import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Download, Trash, CheckCircle, XCircle } from 'lucide-react';
import { applicationLists } from '../../services/applicayionApi';
import moment from 'moment';
import useAppDispatch from '../../hooks/useAppDispatch';

const ApplicantsList = () => {
  const dispatch = useAppDispatch();
  const [applications , setAplications] = useState([]);

  useEffect(() => {

    const fetchJobDetail = async () => {
      try {
          const result = await dispatch(applicationLists());
          setAplications(result?.payload?.response?.data);
      } catch (err) {
      }
  };
  fetchJobDetail(); 
  }, [dispatch]);

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
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
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
            <th>Job</th>
            <th>Ứng viên</th>
            <th>Ngày ứng tuyển</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="border-b">
              <td className="py-2">
                <div className="font-bold">{application.jobTitle}</div>
                <div className="text-gray-500">📍 {application.address}</div>
              </td>
              <td className="py-2">
                <div>{application.fullName || 'Chưa có tên'}</div>
                <div className="flex items-center">
                  CV: <Download className="w-4 h-4 ml-1 cursor-pointer" /> Download
                </div>
              </td>
              <td className="py-2">
                {application.createdAt 
                  ? moment(application.createdAt).format('YYYY-MM-DD HH:mm')
                  : 'Chưa có thời gian'}
              </td>
              <td className="py-2">
                <span className={
                  application.status === 'APPROVED' 
                    ? 'text-green-500' 
                    : application.status === 'REJECTED'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }>
                  {application.status}
                </span>
              </td>
              <td className="py-2">
                <Trash className="inline-block mr-2 text-gray-500 cursor-pointer" size={18} />
                <CheckCircle 
                  className="inline-block mr-2 text-gray-500 cursor-pointer hover:text-green-500" 
                  size={18} 
                />
                <XCircle 
                  className="inline-block text-gray-500 cursor-pointer hover:text-red-500" 
                  size={18} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsList;