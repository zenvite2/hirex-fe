import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, MapPin, Bookmark } from 'lucide-react';
import { jobGet, jobGetWith } from '../../services/jobApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { Link } from "react-router-dom";
import ApplyModal from './ApplyModal';
import CustomModal from '../../components/common/CustomModal';
import ContactNow from './ContactNow';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

interface JobData {
    id: number;
    title: string;
    location: string;
    district: string;
    city: string;
    deadline: string;
    description: string | null;
    requirements: string | null;
    yearExperience: string;
    salary: string;
    tech: string;
    position: string;
    jobType: string;
    contractType: string;
    jobDetails: JobDetails;
    company: CompanyInfo;
    employer: Employer;
    createdAt: string;
}

interface JobDetails {
    responsibilities: string[];
    description: string[];
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

const SIMILAR_JOBS = [
    {
        id: 1,
        title: "Lead UI Designer",
        company: "Gojek",
        location: "Jakarta, Indonesia",
        type: "Fulltime",
        workplace: "Onsite",
        experience: "3-5 Years",
        time: "2 days ago",
        applicants: "521 Aplicants",
        letter: "G"
    },
    {
        id: 2,
        title: "Sr. UX Designer",
        company: "GoPay",
        location: "Jakarta, Indonesia",
        type: "Fulltime",
        workplace: "Onsite",
        experience: "3-5 Years",
        time: "2 days ago",
        applicants: "210 Aplicants",
        letter: "G"
    }
];

const jobData = {
    workplaceType: "Hybrid (2 days WFH)",
    experienceRequired: "3-5 years",
    employmentType: "Full-time",
    aboutRole: "We are seeking a talented Senior Frontend Developer to join our dynamic team. As a Senior Frontend Developer, you will be responsible for building scalable web applications, mentoring junior developers, and contributing to technical architecture decisions. You'll work closely with our product and design teams to create intuitive user experiences while maintaining high code quality standards. This role offers an exciting opportunity to shape the future of our product while working with cutting-edge technologies.",
    qualifications: [
        "3+ years of experience with React.js and modern JavaScript (ES6+)",
        "Thành thạo ngôn ngữ lập trình C#.",
        "Experience with TypeScript and modern frontend build tools",
        "Proficient in HTML5, CSS3, and responsive design principles",
    ],
    responsibilities: [
        "Lập kế hoạch thực hiện mục tiêu của team đề ra.",
        "Hỗ trợ Ban Điều Hành đánh giá nhân sự khi có yêu cầu.",
        "Quản lý công việc và dẫn dắt phát triển nhân sự trong team.",
    ]
};

const JobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<JobData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const { isLoggedIn } = useSelector((state: RootState) => state.authReducer);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                //api get job
                dispatch(startLoading());
                const result = await dispatch(jobGetWith(id));
                dispatch(stopLoading());
                setJob(result?.payload?.response?.data);
            } catch (err) {
                toast.error('Error loading job details');
            }
        };

        if (id) {
            fetchJobDetail();
        }
    }, [id]);

    const handleApplyNow = () => {
        if (!isLoggedIn) {
            window.location.href = '/login';
        } else {
            setIsModalOpen(true);
        }
    };
    const handleSubmit = () => {
        setIsModalOpen(false);
    };

    const handleSaveJob = () => {
        toast.success('Job saved successfully!');
        // Add your save job logic here
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

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Header Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                        {job?.company.logo ? (
                                            <img
                                                src={job?.company.logo}
                                                alt={job?.company.companyName}
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job?.title}</h1>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Link to={`/company/detail/${job?.company.id}`}>
                                                <span className="text-blue-500 hover:underline cursor-pointer">
                                                    {job?.company.companyName}
                                                </span>
                                            </Link>
                                            <span>•</span>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job?.district}, {job?.city}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 mt-2 text-[15px] text-gray-500">
                                            <span>{job?.contractType}</span>
                                            <span>{job?.jobType}</span>
                                            <span>{job?.yearExperience}</span>
                                            <span>{job?.salary}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleSaveJob}
                                        className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                                    >
                                        <Bookmark className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => { isLoggedIn ? setShowContactModal(true) : navigate('/login') }}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                                    >
                                        Liên hệ
                                    </button>
                                    <button
                                        onClick={handleApplyNow}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                                    >
                                        Apply Now
                                    </button></div>
                            </div>
                        </div>

                        {/* Content Sections */}

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <section className="mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-500 rounded"></div>
                                    <h2 className="text-xl font-semibold">Chi tiết tin tuyển dụng</h2>
                                </div>
                            </section>

                            <section className="mb-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Trách nhiệm công việc</h2>
                                <ul className="space-y-1 text-gray-600 leading-relaxed">
                                    {job?.jobDetails.responsibilities.map((responsibility, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="text-gray-400 mt-2">•</span>
                                            <span>{responsibility}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="mb-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng & Chuyên môn</h2>
                                <ul className="space-y-1 text-gray-600 leading-relaxed">
                                    {job?.jobDetails.description.map((description, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="text-gray-400 mt-2">•</span>
                                            <span>{description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="mb-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hình thức làm việc</h2>
                                <ul className="space-y-1 text-gray-600 leading-relaxed">
                                    <li>
                                        <span className="text-gray-400 mt-2 mr-3">•</span>
                                        {job?.contractType}
                                        <br></br>
                                        <span className="text-gray-400 mt-2 mr-2">• </span>
                                        {job?.jobType}
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mức lương</h2>
                                <ul className="space-y-1 text-gray-600 leading-relaxed">
                                    <li>
                                        <span className="text-gray-400 mt-2 mr-2">•  </span>
                                        {job?.salary}
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hạn nộp hồ sơ</h2>
                                <ul className="space-y-1 text-gray-600 leading-relaxed">
                                    <li>
                                        <span className="text-gray-400 mt-2 mr-2">•  </span>
                                        {job?.deadline}
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Similar Jobs Sidebar */}
                    <div className="w-80">
                        <section className="sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Việc làm tương tự</h2>
                            <div className="space-y-4">
                                {SIMILAR_JOBS.map((job) => (
                                    <div key={job?.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <div className="w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center">
                                                    <span className="font-semibold text-gray-800">{job?.letter}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">{job?.title}</h3>
                                                    <div className="text-[15px] text-gray-600">
                                                        {job?.company} • {job?.location}
                                                    </div>
                                                    <div className="flex gap-6 mt-1 text-[15px] text-gray-500">
                                                        <span>{job?.type}</span>
                                                        <span>{job?.workplace}</span>
                                                        <span>{job?.experience}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-2">
                                                        {job?.time} • {job?.applicants}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleSaveJob}
                                                className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                                            >
                                                <Bookmark className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
            <ApplyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                jobId={id}
            />
            <CustomModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} height='small' width='small'>
                {job?.employer && <ContactNow employer={job?.employer} />}
            </CustomModal>
        </div>

    );
};

export default JobDetail;