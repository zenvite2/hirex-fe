import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Download, Trash, CheckCircle, XCircle } from 'lucide-react';
import { applicationLists, applicationUpdate, deleteApplication, ApplicationStatus } from '../../services/applicationApi';
import moment from 'moment';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

const ApplicantsList = () => {
  const dispatch = useAppDispatch();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Lấy danh sách ứng dụng
  const fetchJobDetail = async () => {
    dispatch(startLoading());
    setError(null);
    try {
      const result = await dispatch(applicationLists());
      const data = result?.payload?.response?.data || [];
      setApplications(data);
      setFilteredApplications(data);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách ứng viên');
    } finally {
      dispatch(stopLoading());
    }
  };

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    fetchJobDetail();
  }, []);

  // Hàm cập nhật trạng thái ứng dụng
  const handleUpdateStatus = async (id: number, status: ApplicationStatus) => {
    const originalApplications = [...applications];
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );

    try {
      setUpdatingId(id);
      const result = await dispatch(applicationUpdate({ id, status }));
      if (!result?.payload?.response?.data) {
        throw new Error('Không thể cập nhật trạng thái');
      }
      toast.success(`Cập nhật trạng thái thành ${status}`);
    } catch (err) {
      setApplications(originalApplications);
      toast.error(err.message || 'Có lỗi xảy ra');
    } finally {
      setUpdatingId(null);
    }
  };

  // Hàm xóa ứng dụng
  const handleDeleteApplication = async (id: number) => {
    const originalApplications = [...applications];
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app.id !== id)
    );

    try {
      const result = await dispatch(deleteApplication({ id }));
      toast.success('Xóa đơn ứng tuyển thành công');
    } catch (err) {
      setApplications(originalApplications);
      toast.error(err.message || 'Có lỗi xảy ra');
    } finally {
      setUpdatingId(null);
    }
  };

  // Cập nhật danh sách ứng dụng hiển thị khi tìm kiếm hoặc lọc trạng thái thay đổi
  useEffect(() => {
    let filtered = applications;

    if (searchQuery.trim()) {
      filtered = filtered.filter((app) =>
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, applications]);

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-500 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex mb-4">
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="Tên ứng viên"
          className="border p-2 mr-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Lọc trạng thái */}
        <div className="relative inline-block mr-2">
          <select
            className="border p-2 pr-8 appearance-none rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Chọn trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        // onClick={() => fetchJobDetail()}
        >
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Danh sách ứng tuyển</h2>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-500">Không có dữ liệu ứng viên</div>
        </div>
      ) : (
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
            {filteredApplications.map((application) => (
              <tr key={application.id} className="border-b">
                <td className="py-2">
                  <div className="font-bold">{application.jobTitle}</div>
                  <div className="text-gray-500">📍 {application.address}</div>
                </td>
                <td className="py-2">
                  <div>{application.fullName || 'Chưa có tên'}</div>
                  <div className="flex items-center">
                    {application.cvPdf ? (
                      <a
                        href={application.cvPdf}
                        download={`CV_${application.fullName || 'unnamed'}.pdf`}
                        className="flex items-center text-blue-500 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CV: <Download className="w-4 h-4 ml-1" /> Download
                      </a>
                    ) : (
                      <span className="text-gray-400">Chưa có CV</span>
                    )}
                  </div>
                </td>
                <td className="py-2">
                  {application.createdAt
                    ? moment(application.createdAt).format('YYYY-MM-DD HH:mm')
                    : 'Chưa có thời gian'}
                </td>
                <td className="py-2">
                  <span
                    className={
                      application.status === 'ACCEPTED'
                        ? 'text-green-500'
                        : application.status === 'REJECTED'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }
                  >
                    {application.status}
                  </span>
                </td>
                <td className="py-2">
                  <Trash
                    className={`inline-block mr-2 text-gray-500 cursor-pointer ${updatingId === application.id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    size={18}
                    onClick={() => handleDeleteApplication(application.id)}
                  />
                  <CheckCircle
                    className={`inline-block mr-2 cursor-pointer ${application.status === ApplicationStatus.ACCEPTED
                        ? 'text-green-500'
                        : 'text-gray-500 hover:text-green-500'
                      } ${updatingId === application.id ? 'opacity-50' : ''}`}
                    size={18}
                    onClick={() => {
                      if (application.status !== ApplicationStatus.ACCEPTED) {
                        handleUpdateStatus(application.id, ApplicationStatus.ACCEPTED);
                      }
                    }}
                  />
                  <XCircle
                    className={`inline-block cursor-pointer ${application.status === ApplicationStatus.REJECTED
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                      } ${updatingId === application.id ? 'opacity-50' : ''}`}
                    size={18}
                    onClick={() => {
                      if (application.status !== ApplicationStatus.REJECTED) {
                        handleUpdateStatus(application.id, ApplicationStatus.REJECTED);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicantsList;
