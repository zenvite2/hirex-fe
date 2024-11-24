import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import axiosIns from '../../services/axiosIns';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

interface JobResponse {
  id: number;
  title: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  deadline: string;
}

interface SavedJob {
  id: number;
  jobResponse: JobResponse;
  employeeId: number;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: SavedJob[];
  statusCode: string;
}

const SavedJobsPage = () => {
  const navigate = useNavigate();
  const [filterOption, setFilterOption] = useState<'recent' | 'urgent' | 'salary'>('recent');
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useSelector((state: RootState) => state.authReducer);
  const dispatch = useAppDispatch();

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        dispatch(startLoading());
        const response = await axiosIns.get<ApiResponse>('/saved-job/list', { includeToken: true });
        if (response.data.success) {
          setSavedJobs(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Không thể tải danh sách việc làm đã lưu');
        console.error(err);
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchSavedJobs();
  }, []);

  // Xóa việc làm đã lưu
  const handleDeleteSavedJob = async (jobId: number, savedJobId: number) => {
    try {
      const response = await axiosIns.delete(`/saved-job/${jobId}`, { includeToken: true });
      if (response.data.success) {
        // Cập nhật danh sách việc làm sau khi xóa
        setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== savedJobId));
      } else {
        setError('Không thể xóa việc làm');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xóa việc làm');
      console.error(err);
    }
  };

  // Chuyển đến trang chi tiết việc làm
  const handleJobDetail = (jobId: number) => {
    navigate(`/job-detail/${jobId}`);
  };

  if (error) return <div>Lỗi: {error}</div>;

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
        className="p-6 rounded-lg mb-6 text-black"
      >
        <h1 className="text-2xl font-bold mb-2">Việc làm đã lưu</h1>
        <p className="text-sm">
          Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <h2 className="text-lg mb-4">Danh sách {savedJobs.length} việc làm đã lưu</h2>
        <div className="flex gap-4 items-center">
          {/* <span className="text-gray-600">Ưu tiên hiển thị:</span>
          <div className="flex gap-4">
          </div> */}
        </div>
      </div>

      {/* Job Cards */}
      {savedJobs.map(savedJob => (
        <div key={savedJob.id} className="bg-rose-50 rounded-lg shadow-sm mb-4">
          <div className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="text-lg font-semibold text-black cursor-pointer hover:underline"
                      onClick={() => handleJobDetail(savedJob.jobResponse.id)}
                    >
                      {savedJob.jobResponse.title}
                    </h3>
                    <br></br>
                    <p className="text-gray-600">Ngày lưu: {new Date(savedJob.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-black font-semibold" style={{ fontSize: 20 }}>
                    {savedJob.jobResponse.minSalary.toLocaleString()} - {savedJob.jobResponse.maxSalary.toLocaleString()} VND
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{savedJob.jobResponse.location}</span>
                    <span>•</span>
                    <span>Hạn nộp: {new Date(savedJob.jobResponse.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-500"
                      onClick={() => handleJobDetail(savedJob.jobResponse.id)}
                    >
                      Ứng tuyển
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700"
                      onClick={() => handleDeleteSavedJob(savedJob.jobResponse.id, savedJob.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedJobsPage;