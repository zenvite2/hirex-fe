import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, MapPin, Bookmark, MessageCircle, CalendarCheck, Navigation, BriefcaseConveyorBelt, Users, Heart } from 'lucide-react';
import { fetchFollowCompany, fetchSavedJobs, getSimilarJobs, jobGetWith } from '../../services/jobApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { Link } from "react-router-dom";
import ApplyModal from './ApplyModal';
import CustomModal from '../../components/common/CustomModal';
import ContactNow from './ContactNow';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import axiosIns from '../../services/axiosIns';
import { Job } from './FindJobs';
import { denormalizeTextAreaContent, formatDateToDDMMYYYY } from '../../utils/utils';

interface JobData {
    id: number;
    title: string;
    location: string;
    district: string;
    city: string;
    deadline: string;
    description: string | null;
    requirement: string | null;
    yearExperience: string;
    benefit: string;
    workingTime: string;
    minSalary: number;
    maxSalary: number;
    position: string;
    jobType: string;
    contractType: string;
    email: string;
    company: CompanyInfo;
    employer: Employer;
    createdAt: string;
}

interface CompanyInfo {
    id: number;
    employerId: number;
    companyName: string;
    description: string | null;
    website: string | null;
    logo: string | null;
    address: string;
    city: number;
    district: number;
    scale: number;
}

interface Employer {
    userId: number,
    fullName: string | null,
    email: string | null,
    phoneNumber: string,
    avatar: string | null
}

const JobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<JobData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.authReducer);
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [similarJobs, setSimilarJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                dispatch(startLoading());
                const result = await dispatch(jobGetWith(id));
                dispatch(stopLoading());
                setJob(result?.payload?.response?.data);
            } catch (err) {
                setError('Error loading job details');
                toast.error('Error loading job details');
            }
        };

        const fetchSimilarJobs = async () => {
            const result = await getSimilarJobs(id);
            setSimilarJobs(result ?? []);
        };

        if (id) {
            fetchJobDetail();
            fetchSimilarJobs();
        }
    }, [id]);

    useEffect(() => {
        const checkSavedJobs = async () => {
            try {
                if (!isLoggedIn) return;
                const savedJobs = await fetchSavedJobs();

                if (job) { // Kiểm tra xem công việc hiện tại có trong danh sách đã lưu
                    const isJobSaved = savedJobs.some((savedJob) => savedJob.jobResponse.id === job.id);
                    setIsSaved(isJobSaved); // Cập nhật trạng thái
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra danh sách việc làm đã lưu:", error);
            }
        };

        const checkFollowCompany = async () => {
            try {
                if (!isLoggedIn) return;
                const savedJobs = await fetchFollowCompany();

                if (job) { // Kiểm tra xem công việc hiện tại có trong danh sách đã lưu
                    const isFollowed = savedJobs.some((isFollow) => isFollow?.companyId === job.company.id);
                    setIsFollowed(isFollowed); // Cập nhật trạng thái
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra danh sách việc làm đã lưu:", error);
            }
        };

        if (id) {
            checkSavedJobs();
            checkFollowCompany();
        }
    }, [isLoggedIn, job, id]);

    const handleApplyNow = () => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSubmit = () => {
        setIsModalOpen(false);
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

    const handleFollowCompany = async () => {
        if (!isLoggedIn) {
            toast.error("Vui lòng đăng nhập để theo dõi công ty");
            return;
        }

        try {
            if (isFollowed) {
                // Gọi API xóa công việc đã lưu
                const response = await axiosIns.delete(`/follow-company/${job.company.id}`, { includeToken: true });
                if (response.data.success) {
                    setIsFollowed(false);
                    toast.success("Đã xóa khỏi danh sách theo dõi công ty");
                } else {
                    toast.error(response.data.message || "Không thể xóa công ty đã theo dõi");
                }
            } else {
                // Gọi API lưu công việc
                const followRequest = { companyId: job.company.id, employeeId: userId };
                const response = await axiosIns.post("/follow-company", followRequest, { includeToken: true });
                if (response.data.success) {
                    setIsFollowed(true);
                    toast.success("Đã theo dõi công ty thành công");
                } else {
                    toast.error(response.data.message || "Không thể theo dõi công ty");
                }
            }
        } catch (error) {
            console.error("Lỗi khi theo dõi công ty:", error);
            toast.error("Đã xảy ra lỗi, vui lòng thử lại");
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">
                    {error || 'Job not found'}
                </div>
            </div>
        );
    }

    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return 'Thương lượng';
        const formatter = new Intl.NumberFormat('vi-VN');
        return `Từ ${formatter.format(min)} - ${formatter.format(max)} VNĐ`;
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header Section */}
                        <div className="bg-white p-6 shadow-sm">
                            <div className="flex gap-4">
                                {/* Company Logo */}
                                <div className="w-20 h-20 bg-white border border-gray-200  flex items-center justify-center p-2">
                                    {job?.company.logo ? (
                                        <img
                                            src={job?.company.logo}
                                            alt={job?.company.companyName}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 className="w-10 h-10 text-gray-400" />
                                    )}
                                </div>

                                {/* Job Information */}
                                <div className="flex-1">
                                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job?.title}</h1>
                                    <Link to={`/company/detail/${job?.company.id}`}>
                                        <p className="text-lg text-blue-600 hover:underline mb-2">{job?.company.companyName}</p>
                                    </Link>

                                    <div className="flex flex-col gap-y-2 mb-2">
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{job?.district}, {job?.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <span>💰</span>
                                            <span>{formatSalary(job?.minSalary || 0, job?.maxSalary || 0)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                            <span>⏰</span>
                                            <span>{job?.yearExperience} kinh nghiệm</span>
                                        </div>
                                    </div>

                                    {/* Post Date and Deadline */}
                                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                                        <span>Ngày đăng tuyển {new Date(job?.createdAt || '').toLocaleDateString('vi-VN')}</span>
                                        <span>|</span>
                                        <span>Hạn nộp hồ sơ: {job?.deadline ? `${job?.deadline}` : 'N/A'}</span>
                                        <span>|</span>
                                        <span>Email liên hệ: {job?.email}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleApplyNow}
                                        className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                                    >
                                        Nộp đơn ngay
                                    </button>

                                    <button
                                        onClick={() => { isLoggedIn ? setShowContactModal(true) : navigate('/login') }}
                                        className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Liên hệ
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            handleSaveJob();
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className={`w-full px-6 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center gap-2 ${isSaved ? "text-blue-600" : "text-gray-600"
                                            }`}
                                    >
                                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : "stroke-current"}`} />
                                        Lưu việc làm
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            handleFollowCompany();
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className={`w-full px-6 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center gap-2 ${isFollowed ? "text-blue-600" : "text-gray-600"
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${isFollowed ? "fill-current" : "stroke-current"}`} />
                                        Theo dõi công ty
                                    </button>
                                </div>

                            </div>
                        </div>
                        <hr />
                        {/* Job Details Section */}
                        <div className="bg-white p-6 shadow-sm mt-2">
                            <section className="mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-500 rounded"></div>
                                    <h2 className="text-xl font-semibold">Chi tiết tin tuyển dụng</h2>
                                </div>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mô tả công việc</h2>
                                <ul className="space-y-2 text-gray-600">
                                    <p
                                        className="text-gray-600"
                                        style={{ lineHeight: '2' }}
                                        dangerouslySetInnerHTML={{ __html: denormalizeTextAreaContent(job?.description || '') }}
                                    ></p>
                                </ul>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu công việc</h2>
                                <ul className="space-y-2 text-gray-600">
                                    <p
                                        className="text-gray-600"
                                        style={{ lineHeight: '2' }}
                                        dangerouslySetInnerHTML={{ __html: denormalizeTextAreaContent(job?.requirement || '') }}
                                    ></p>
                                </ul>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Phúc lợi</h2>
                                <ul className="space-y-2 text-gray-600">
                                    <p
                                        className="text-gray-600"
                                        style={{ lineHeight: '2' }}
                                        dangerouslySetInnerHTML={{ __html: denormalizeTextAreaContent(job?.benefit || '') }}
                                    ></p>
                                </ul>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hình thức làm việc</h2>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <span className="text-gray-400">-</span>
                                        {job?.contractType}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-gray-400">-</span>
                                        {job?.jobType}
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mức lương</h2>
                                <div className="text-gray-600">
                                    <span className="text-gray-400 mr-2">-</span>
                                    {formatSalary(job?.minSalary || 0, job?.maxSalary || 0)}
                                </div>
                            </section>

                            <section className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thời gian làm việc</h2>
                                <ul className="space-y-2 text-gray-600">
                                    <p
                                        className="text-gray-600"
                                        style={{ lineHeight: '2' }}
                                        dangerouslySetInnerHTML={{ __html: denormalizeTextAreaContent(job?.workingTime || '') }}
                                    ></p>
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Similar Jobs Sidebar */}
                    <div className="w-80">
                        <section className="sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Việc làm tương tự</h2>
                            <div className="space-y-4">
                                {similarJobs?.map((similarJob) => (
                                    <div
                                        key={similarJob.id}
                                        className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
                                        onClick={() => {
                                            similarJob.id && navigate(`/job-detail/${similarJob.id}`);
                                        }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                                                    <img
                                                        src={similarJob.companyLogo}
                                                        alt="Company Logo"
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-[16px] mb-1 group-hover:text-blue-600 transition-colors">
                                                        {similarJob.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-1.5">
                                                        <MapPin className="w-4 h-4 text-gray-500" />
                                                        <span className="font-medium">{similarJob.district} - {similarJob.city}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-1.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <BriefcaseConveyorBelt className="w-4 h-4 text-gray-500" />
                                                            <span>{similarJob.jobType ?? '...'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[14px] text-gray-500">
                                                        <CalendarCheck className="w-4 h-4 text-gray-500" />
                                                        <span>Hết hạn {formatDateToDDMMYYYY(similarJob.deadline)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleSaveJob}
                                                className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors group-hover:border-blue-200"
                                            >
                                                <Bookmark className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ApplyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                jobId={id}
            />
            <CustomModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                height='small'
                width='small'
            >
                {job?.employer && job.id && <ContactNow employer={job.employer} jobId={job.id} />}
            </CustomModal>
        </div>
    );
};

export default JobDetail;