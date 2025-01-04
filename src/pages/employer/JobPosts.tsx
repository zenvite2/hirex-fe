import React, { useState, useEffect } from 'react';
import { Pencil, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jobGetAll, jobDelete } from '../../services/jobApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { Transition } from '@headlessui/react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(startLoading());
      try {
        const result = await dispatch(jobGetAll());
        if (result?.payload?.response?.success === true) {
          setJobs(result.payload.response.data);
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải danh sách công việc');
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchJobs();
  }, [dispatch]);

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

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      await dispatch(jobDelete(jobToDelete.id));
      setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
      toast.success('Xóa công việc thành công!');
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa công việc');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách tin tuyển dụng</h1>
        <Link to="/apply-job">
          <button className="bg-[#0069DB] text-white px-3 py-2 rounded-md hover:bg-[#0050B3] transition duration-300">
            Thêm mới
          </button>
        </Link>
      </div>

      {/* Modal Xóa */}
      {(
        <Transition
          show={showDeleteModal}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 transform scale-95 translate-y-4"
          enterTo="opacity-100 transform scale-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 transform scale-100 translate-y-0"
          leaveTo="opacity-0 transform scale-95 translate-y-4"
        >
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa công việc này?</h2>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={handleDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </Transition>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-pink-500 border-b">
              <th className="py-3">Tiêu đề</th>
              <th className="py-3">Thời gian tạo / Hạn HS</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3">Số lượng ứng tuyển</th>
              <th className="py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-gray-500 text-sm mt-1">📍{job.location}</div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-600">{formatDate(job.createdAt)}</div>
                  <div className="text-sm text-gray-600 mt-1">{formatDate(job.deadline)}</div>
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${job.active === true
                      ? 'bg-green-100 text-green-800'
                      : job.active === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {job.active === true ? 'Đã duyệt' : job.active === false ? 'Từ chối' : 'Chờ duyệt'}
                  </span>
                </td>
                <td className="text-center">{job.countApplication}</td>
                <td className="py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/jobs/edit/${job.id}`)}
                      className="hover:text-yellow-600 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(job)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">Chưa có công việc nào được đăng tải</div>
      )}
    </div>
  );
};

export default JobListings;
