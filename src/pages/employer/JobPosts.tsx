import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Link, useNavigate  } from 'react-router-dom';
import { jobGetAll } from '../../services/jobApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const result = await dispatch(jobGetAll());
        if (result?.payload?.response?.success == true) {
          console.log(result.payload.response.data)
          setJobs(result.payload.response.data);
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải danh sách công việc');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách công việc</h1>
        <Link to="/apply-job">
          <button className="bg-[#0069DB] text-white px-3 py-2 rounded-md hover:bg-[#0050B3] transition duration-300">
            Thêm mới
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-pink-500 border-b">
              <th className="py-3">Tiêu đề</th>
              <th className="py-3">Thời gian tạo / Hạn hs</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-gray-500 text-sm mt-1">
                    {job.location}, {job.district}, {job.city}
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-600">{formatDate(job.createdAt)}</div>
                  <div className="text-sm text-gray-600 mt-1">{formatDate(job.deadline)}</div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${job.status === 'Đã duyệt'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {job.status || 'Chờ duyệt'}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/jobs/edit/${job.id}`)}
                      className="hover:text-yellow-600 transition-colors"
                    >                      <Pencil size={18} />
                    </button>
                    <button className="hover:text-red-600 transition-colors">
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {jobs.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Chưa có công việc nào được đăng tải
        </div>
      )}
    </div>
  );
};

export default JobListings;