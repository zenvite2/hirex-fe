
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axiosIns from "../../services/axiosIns";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState, useEffect } from "react";
import { Job } from "../../pages/employee/FindJobs";
import { Building2, MapPin, Bookmark, MessageCircle, CalendarCheck, Navigation, BriefcaseConveyorBelt, Users, Heart } from 'lucide-react';
import { formatDateToDDMMYYYY } from "../../utils/utils";


interface JobCardProps {
  job: Job;
}

const SimilarCard: React.FC<JobCardProps> = ({ job }) => {
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.authReducer);
  const navigate = useNavigate();
  // Trạng thái kiểm tra job đã được lưu hay chưa
  const [isSaved, setIsSaved] = useState(false);

  // Gọi API để kiểm tra danh sách các công việc đã lưu
  useEffect(() => {
    const checkSavedJobs = async () => {
      try {
        if (!isLoggedIn) return; // Không gọi API nếu người dùng chưa đăng nhập
        const response = await axiosIns.get(`/saved-job/list`, { includeToken: true });
        const savedJobs = response.data.data; // Danh sách công việc đã lưu từ backend

        // Kiểm tra job hiện tại có trong danh sách đã lưu không
        const isJobSaved = savedJobs.some((savedJob: any) => savedJob.jobResponse.id === job.id);
        setIsSaved(isJobSaved); // Cập nhật trạng thái
      } catch (error) {
        console.error("Lỗi khi kiểm tra danh sách việc làm đã lưu:", error);
      }
    };

    checkSavedJobs();
  }, [isLoggedIn, job.id]);

  const handleSaveJob = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để lưu việc làm");
      return;
    }

    try {
      if (isSaved) {
        // Gọi API xóa công việc đã lưu
        const response = await axiosIns.delete(`/saved-job/${job.id}`, { includeToken: true });
        if (response.data.success) {
          setIsSaved(false);
          toast.success("Đã xóa khỏi danh sách lưu");
        } else {
          toast.error(response.data.message || "Không thể xóa việc làm đã lưu");
        }
      } else {
        // Gọi API lưu công việc
        const savedJobRequest = { jobId: job.id, employeeId: userId };
        const response = await axiosIns.post("/saved-job", savedJobRequest, { includeToken: true });
        if (response.data.success) {
          setIsSaved(true);
          toast.success("Đã lưu việc làm thành công");
        } else {
          toast.error(response.data.message || "Không thể lưu việc làm");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu/xóa việc làm:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  return (
    <div
      key={job.id}
      className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-white border border-gray-200  flex items-center justify-center p-2">
            {job?.companyLogo ? (
              <img
                src={job?.companyLogo}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div
            onClick={() => {
              job.id && navigate(`/job-detail/${job.id}`);
            }}
          >
            <h3 className="text-lg font-semibold truncate">
              {job?.title?.length > 15 ? `${job?.title?.slice(0, 15)}...` : job?.title}
            </h3>
            <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-1.5">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{job.district} - {job.city}</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-1.5">
              <div className="flex items-center gap-1.5">
                <BriefcaseConveyorBelt className="w-4 h-4 text-gray-500" />
                <span>{job.jobType ?? '...'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-gray-500">
              <CalendarCheck className="w-4 h-4 text-gray-500" />
              <span>Hết hạn {formatDateToDDMMYYYY(job.deadline)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            handleSaveJob();
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`ml-auto p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 ${isSaved ? "text-blue-600" : "text-gray-600"
            }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : "stroke-current"}`} />
        </button>
      </div>
    </div>
  );
};

export default SimilarCard;
