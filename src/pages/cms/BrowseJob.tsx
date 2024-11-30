import React, { useState, useEffect } from "react";
import { CheckCircle, ChevronDown, Eye, Pencil, Search, Trash, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { jobGetAllCMS, updateRejectJobCMS, updateAcceptJobCMS } from "../../services/jobApi";
import { toast } from "react-toastify";
import useAppDispatch from "../../hooks/useAppDispatch";
import { startLoading, stopLoading } from "../../redux/slice/loadingSlice";

const BrowseJob = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm
  const [statusFilter, setStatusFilter] = useState(""); // Lọc trạng thái
  const [filteredJobs, setFilteredJobs] = useState([]); // Danh sách sau lọc
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(startLoading());
      try {
        const result = await dispatch(jobGetAllCMS());
        if (result?.payload?.response?.success === true) {
          setJobs(result.payload.response.data);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải danh sách công việc");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchJobs();
  }, []);

  // Tìm kiếm và lọc
  const handleSearchAndFilter = () => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" || job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "PENDING" && job.active === null) ||
        (statusFilter === "ACCEPTED" && job.active === true) ||
        (statusFilter === "REJECTED" && job.active === false);

      return matchesSearch && matchesStatus;
    });

    setFilteredJobs(filtered);
  };

  // Áp dụng tìm kiếm và lọc khi dữ liệu thay đổi
  useEffect(() => {
    handleSearchAndFilter();
  }, [jobs, searchQuery, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleUpdateReject = async (jobId) => {
    try {
      await dispatch(updateRejectJobCMS(jobId));
      // Cập nhật lại trạng thái công việc trong state jobs       
      setJobs((prevJobs) => prevJobs.map((job) => job.id === jobId ? { ...job, active: false } : job));
      toast.success("Từ chối đăng công việc thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi từ chối công việc");
    }
  };

  const handleUpdateAccept = async (jobId) => {
    try {
      await dispatch(updateAcceptJobCMS(jobId));
      // Cập nhật lại trạng thái công việc trong state jobs 
      setJobs((prevJobs) => prevJobs.map((job) => job.id === jobId ? { ...job, active: true } : job));

      toast.success("Chấp nhận đăng công việc thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chấp nhận công việc");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách công việc</h1>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Tên job"
          className="border p-2 mr-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border p-2 pr-8 appearance-none rounded mr-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Chọn trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="ACCEPTED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={handleSearchAndFilter}
        >
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-pink-500 border-b">
              <th className="py-3">Tiêu đề</th>
              <th className="py-3">Thời gian tạo job</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4">
                  <Link
                    to={`/cms/job/${job?.id}`}
                    className="font-medium text-blue-500 hover:underline"
                  >
                    {job?.title}
                  </Link>
                  <div className="text-gray-500 text-sm mt-1">
                    {job?.location}
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-600">{formatDate(job?.createdAt)}</div>
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${job?.active === true
                      ? 'bg-green-100 text-green-800' // Màu cho "Đã duyệt"
                      : job?.active === false
                        ? 'bg-red-100 text-red-800' // Màu cho "Đã từ chối"
                        : 'bg-yellow-100 text-yellow-800' // Màu cho "Chờ duyệt"
                      }`}
                  >
                    {job?.active === true
                      ? 'Đã duyệt'
                      : job?.active === false
                        ? 'Đã từ chối'
                        : 'Chờ duyệt'}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateAccept(job?.id)}
                      className="hover:text-red-600 transition-colors">
                      <CheckCircle size={18}
                        className={`inline-block cursor-pointer ${job?.active === true
                          ? 'text-green-500'
                          : 'text-gray-500 hover:text-red-500'
                          }`}
                      />
                    </button>
                    <button
                      onClick={() => handleUpdateReject(job?.id)}
                      className="hover:text-red-600 transition-colors">
                      <XCircle size={18}
                        className={`inline-block cursor-pointer ${job?.active === false
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                          }`}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">Không tìm thấy công việc phù hợp</div>
      )}
    </div>
  );
};

export default BrowseJob;
