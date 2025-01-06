import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, MapPin, Bookmark, MessageCircle, CalendarCheck, Navigation, BriefcaseConveyorBelt, Users, Heart } from 'lucide-react';
import { deleteApplicationId, fetchAppliedJobs, fetchFollowCompany, fetchSavedJobs, getSimilarJobs, jobGetWith } from '../../services/jobApi';
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
import { deleteApplication, deleteApplicationNew } from '../../services/applicationApi';
import SimilarCard from '../../components/common/SimilarCard';
import { set } from 'react-hook-form';
import { Transition } from '@headlessui/react';

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
    const { isLoggedIn, userId, role } = useSelector((state: RootState) => state.authReducer);
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
    const [applicationId, setApplicationId] = useState<number | null>(null); // State lưu id đơn ứng tuyển
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null); // State lưu id đơn ứng tuyển

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

        const checkAppliedJobs = async () => {
            try {
                if (!isLoggedIn) return; // Nếu chưa đăng nhập thì không kiểm tra

                // Gọi API để lấy danh sách công việc đã ứng tuyển
                const appliedJobs = await fetchAppliedJobs();

                if (job) {
                    // Kiểm tra xem công việc hiện tại có trong danh sách đã ứng tuyển hay chưa
                    // const hasApplied = appliedJobs.some((appliedJob) => appliedJob.jobId === job.id);

                    const appliedJob = appliedJobs.find((appliedJob) => appliedJob.jobId === job.id);

                    if (appliedJob) {
                        setHasApplied(true); // Cập nhật trạng thái đã ứng tuyển
                        setApplicationId(appliedJob.id); // Lưu applicationId
                        setApplicationStatus(appliedJob.status); // Lưu trạng thái ứng tuyển
                    } else {
                        setHasApplied(false); // Cập nhật trạng thái chưa ứng tuyển
                        setApplicationId(null); // Xóa applicationId nếu không tìm thấy
                        setApplicationStatus(null); // Xóa trạng thái ứng tuyển
                    }
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra danh sách việc làm đã ứng tuyển:", error);
            }
        };

        if (id) {
            checkSavedJobs();
            checkFollowCompany();
            checkAppliedJobs();
        }
    }, [isLoggedIn, job, id]);

    const handleDeleteApplication = async () => {
        console.log('applicationId', applicationId);
        if (!applicationId) return; // Không làm gì nếu không có applicationId

        try {
            const result = await deleteApplicationNew({ id: applicationId });
            console.log(result)
            setHasApplied(false); // Cập nhật trạng thái về "chưa ứng tuyển"
            setApplicationId(null); // Xóa applicationId sau khi xóa thành công
            setShowDeleteConfirm(false); // Đóng popup
            toast.success("Đã xóa đơn ứng tuyển");
        } catch (error) {
            console.error("Lỗi khi xóa đơn ứng tuyển:", error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false); // Đóng popup khi nhấn "Không"
    };

    const handleApplyNow = () => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSubmit = (data: any) => {
        setIsModalOpen(false);
        setHasApplied(true);
        setApplicationId(data.id)    
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
                                        <span>Hạn nộp hồ sơ: {formatDateToDDMMYYYY(job?.deadline)}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {role !== 'EMPLOYER' && (
                                    <div className="flex flex-col gap-4">
                                        {/* <button
                                        onClick={handleApplyNow}
                                        className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                                    >
                                        Nộp đơn ngay
                                    </button> */}
                                        {hasApplied ? (
                                            applicationStatus === 'ACCEPTED' ? (
                                                <button
                                                    className="w-full px-6 py-2 bg-green-100 text-green-800 rounded-lg font-medium"
                                                >
                                                    Đã được chấp nhận
                                                </button>
                                            ) : applicationStatus === 'REJECTED' ? (
                                                <button
                                                    className="w-full px-6 py-2 bg-red-100 text-red-800 rounded-lg font-medium"
                                                >
                                                    Đơn bị từ chối
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)} // Hiển thị popup xác nhận
                                                    className="w-full px-6 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium"
                                                >
                                                    Chờ duyệt
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                onClick={handleApplyNow}
                                                className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                                            >
                                                Nộp đơn ngay
                                            </button>
                                        )}

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
                                )}
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
                                    <SimilarCard job={similarJob} key={similarJob.id} />
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

            <Transition
                show={showDeleteConfirm}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 transform scale-95 translate-y-4"
                enterTo="opacity-100 transform scale-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 transform scale-100 translate-y-0"
                leaveTo="opacity-0 transform scale-95 translate-y-4"
            >
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Xác nhận</h3>
                        <p>Bạn có chắc muốn xóa đơn ứng tuyển này không?</p>
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 text-black rounded"
                                onClick={handleCancelDelete}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => handleDeleteApplication()}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default JobDetail;