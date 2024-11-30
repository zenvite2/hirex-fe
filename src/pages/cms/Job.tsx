import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, MapPin, Bookmark, MessageCircle, CalendarCheck, Navigation, BriefcaseConveyorBelt, Users, Heart } from 'lucide-react';
import { getSimilarJobs, jobGetWith } from '../../services/jobApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import axiosIns from '../../services/axiosIns';
import { Job } from '../employee/FindJobs';
import { formatDateToDDMMYYYY } from '../../utils/utils';
import { jobGetAllCMS, jobDelete, updateRejectJobCMS, updateAcceptJobCMS } from '../../services/jobApi';

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

const JobCMS = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<JobData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const { isLoggedIn, userId } = useSelector((state: RootState) => state.authReducer);
    const navigate = useNavigate();

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

        if (id) {
            fetchJobDetail();
        }
    }, [id]);

    const denormalizeTextAreaContent = (content: string): string => {
        if (!content) return '';
        return content.replace(/\\n/g, '<br />').replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
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

    const handleUpdateReject = async (jobId) => {
        try {
            await dispatch(updateRejectJobCMS(jobId));
            toast.success('Tù chối đăng công việc thành công thành công!');
            navigate('/cms/browse-job');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa công việc');
        }
    };

    const handleUpdateAccept = async (jobId) => {
        try {
            await dispatch(updateAcceptJobCMS(jobId));
            toast.success('Chấp nhận đăng công việc thành công!');
            navigate('/cms/browse-job');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa công việc');
        }
    };

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
                </div>
            </div>

            <div className="fixed bottom-4 right-4 flex gap-4">
                <button
                    onClick={() => handleUpdateAccept(job?.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow-md transition-all"
                >
                    Chấp nhận
                </button>
                <button
                    onClick={() => handleUpdateReject(job?.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow-md transition-all"
                >
                    Từ chối
                </button>
            </div>
        </div>
    );
};

export default JobCMS;