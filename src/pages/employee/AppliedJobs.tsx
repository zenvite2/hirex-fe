import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Download, Trash } from 'lucide-react';
import { appliedJob, deleteApplication } from '../../services/applicationApi';
import moment from 'moment';
import useAppDispatch from '../../hooks/useAppDispatch';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

const AppliedJob = () => {
  const { userId } = useSelector((state: RootState) => state.authReducer);
  const dispatch = useAppDispatch();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  // Bộ lọc trạng thái và tìm kiếm
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hàm lấy danh sách ứng dụng
  const fetchJobDetail = async () => {
    dispatch(startLoading());
    setError(null);
    try {
      const result = await dispatch(appliedJob({ userId }));
      setApplications(result?.payload?.response?.data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách ứng viên');
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, []);

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

  // Lọc và tìm kiếm dữ liệu
  const filteredApplications = applications
    .filter((application) =>
      filterStatus === '' || application.status === filterStatus
    )
    .filter((application) =>
      searchQuery === '' ||
      application.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header Section */}
      <div
        style={{
          backgroundImage:
            'radial-gradient(circle 311px at 8.6% 27.9%, rgba(62,147,252,0.57) 12.9%, rgba(239,183,192,0.44) 91.2%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="p-6 rounded-lg mb-6 text-black mt-4"
      >
        <h1 className="text-2xl font-bold mb-2">Việc làm đã ứng tuyển</h1>
        <p className="text-sm">
          Xem lại danh sách những việc làm mà bạn đã ứng tuyển trước đó.
        </p>
      </div>


      {/* Bộ lọc và tìm kiếm */}
      <div>
        <div className="flex mb-4 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề công việc..."
            className="border p-2 mr-2 rounded flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="relative inline-block mr-2">
            <select
              className="border p-2 pr-8 appearance-none rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Chọn trạng thái</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none" />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </button>
        </div>

        {/* Danh sách ứng dụng */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-500">Không có dữ liệu ứng tuyển</div>
          </div>
        ) : (
          <div className='p-5 bg-rose-50 rounded-lg'>
            <table className="w-full">
              <thead>
                <tr className="text-left text-pink-500">
                  <th>Job</th>
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
                    <td className="py-2 text-center align-middle">
                      <Trash
                        className={`inline-block mr-2 text-gray-500 cursor-pointer ${updatingId === application.id
                          ? 'opacity-50 pointer-events-none'
                          : ''
                          }`}
                        size={18}
                        onClick={() => handleDeleteApplication(application.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJob;
