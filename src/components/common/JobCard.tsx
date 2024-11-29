import { FaDollarSign } from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";
import { Building2, Bookmark } from 'lucide-react'; // Icon cho lưu và chưa lưu
import { toast } from 'react-toastify';
import axiosIns from "../../services/axiosIns";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState, useEffect } from "react";
import { Job } from "../../pages/employee/FindJobs";
import { convertNumberToLocaleString, formatNumberToVietnameseShort } from "../../utils/utils";


interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { isLoggedIn, userId } = useSelector((state: RootState) => state.authReducer);

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

  const convertString = (input: string): string => {
    return input.replace(`\n`, '.');
  };

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
    <Link to={`/job-detail/${job.id}`}>
      <div className="w-full max-w-sm bg-white shadow-lg rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="h-12 w-12 object-contain mr-3"
              />
            ) : (
              <Building2 className="h-12 w-12 text-gray-400 mr-3" />
            )}
            <div>
              <h3 className="text-lg font-semibold truncate">
                {job?.title?.length > 16 ? `${job.title.slice(0, 16)}...` : job.title}
              </h3>
              <p className="text-gray-500 text-sm truncate">
                {job?.companyName?.length > 16 ? `${job.companyName.slice(0, 16)}...` : job.companyName}
              </p>
            </div>
            {/* <button
              onClick={(e) => {
                handleSaveJob();
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`ml-auto p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 ${
                isSaved ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {isSaved ? <BookmarkFill className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button> */}
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span
                className={`
                  py-1 px-2 rounded-md text-xs font-semibold
                  ${job.contractType === 'Toàn thời gian' ? 'bg-[#26d81d26] text-[#26d81d]' :
                    job.contractType === 'Bán thời gian' ? 'bg-[#1d87d826] text-[#1d87d8]' :
                      job.contractType === 'Thực tập' ? 'bg-[#ffa50026] text-[#ffa500]' :
                        'bg-gray-100 text-gray-600'
                  }`}
              >
                {job.contractType}
              </span>
            </div>
            <div className="flex items-center">
              {/* <FaDollarSign className="text-gray-500 mr-1" /> */}
              <span className="text-xs text-gray-600">{formatNumberToVietnameseShort(job.minSalary)} - {formatNumberToVietnameseShort(job.maxSalary)}</span>
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {convertString(job.description)}
          </p>
          <div className="my-2 border-b border-gray-300"></div>
          <div className="flex items-center justify-between">
            <span className="bg-[#1d4fd826] text-[#1d4fd8] py-1 px-2 rounded-md text-xs font-semibold">
              {job.district}, {job.city}
            </span>
            <span className="text-gray-500 text-xs">
              {moment(job.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
