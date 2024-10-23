import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, MapPin, Share2, Bookmark } from 'lucide-react';
import { jobGet } from '../../services/jobApi';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import ApplyModal from './ApplyModal';

interface JobDetail {
    id: number;
    title: string;
    location: string;
    district: string;
    city: string;
    deadline: string;
    createdAt: string;
    companyName: string;
    companyLogo: string | null;
    companyDescription: string | null;
    workplaceType: string;
    experienceRequired: string;
    employmentType: string;
    aboutRole: string;
    qualifications: string[];
    responsibilities: string[];
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
        "Bachelor's degree in Computer Science, Engineering or related field",
        "3+ years of experience with React.js and modern JavaScript (ES6+)",
        "Strong understanding of state management (Redux, Context API)",
        "Experience with TypeScript and modern frontend build tools",
        "Proficient in HTML5, CSS3, and responsive design principles",
        "Experience with REST APIs and GraphQL",
        "Strong problem-solving skills and attention to detail",
        "Excellent communication skills and ability to work in a team environment",
        "Experience with testing frameworks (Jest, React Testing Library)",
        "Knowledge of web performance optimization techniques"
    ],
    responsibilities: [
        "Develop and maintain complex frontend applications using React.js",
        "Write clean, maintainable, and efficient code following best practices",
        "Collaborate with backend developers to integrate frontend applications with APIs",
        "Participate in code reviews and provide constructive feedback to team members",
        "Mentor junior developers and share knowledge within the team",
        "Optimize applications for maximum performance and scalability",
        "Implement responsive designs and ensure cross-browser compatibility",
        "Work with UI/UX designers to implement visual elements and user interactions",
        "Contribute to technical architecture decisions and development standards",
        "Stay up-to-date with emerging technologies and industry trends"
    ]
};

const JobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<JobDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const result = await dispatch(jobGet(id));
                setJob(result?.payload?.response?.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch job details');
                toast.error('Error loading job details');
            }
        };

        if (id) {
            fetchJobDetail();
        }
    }, [id]);

    const handleApplyNow = () => {
        console.log("Button clicked!"); // Thêm dòng này
        setIsModalOpen(true);
    }

    const handleSubmit = () => {
        setIsModalOpen(false);
    };

    const handleSaveJob = () => {
        toast.success('Job saved successfully!');
        // Add your save job logic here
    };

    const handleShareJob = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };


    if (error || !job) {
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
                    <div className="bg-white flex-1 p-6 rounded-xl shadow-sm">
                        {/* Header Section */}
                        <div className="bg-white flex items-start justify-between mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                    {job.companyLogo ? (
                                        <img
                                            src={job.companyLogo}
                                            alt={job.companyName}
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    ) : (
                                        <Building2 className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="text-blue-500 hover:underline cursor-pointer">
                                            {job.companyName}
                                        </span>
                                        <span>•</span>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{job.district}, {job.city}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 mt-2 text-[15px] text-gray-500">
                                        <span>{jobData.employmentType}</span>
                                        <span>{jobData.workplaceType}</span>
                                        <span>{jobData.experienceRequired}</span>
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
                                    onClick={handleShareJob}
                                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleApplyNow}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>

                        {/* About Section */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">About this role</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {jobData.aboutRole}
                            </p>
                        </section>

                        {/* Qualification Section */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Qualification</h2>
                            <ul className="space-y-2.5 text-gray-600 leading-relaxed">
                                {jobData.qualifications.map((qualification, index) => (
                                    <li key={index} className="flex gap-3">
                                        <span className="text-gray-400 mt-2">•</span>
                                        <span>{qualification}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Responsibility Section */}
                        <section className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibility</h2>
                            <ul className="space-y-2.5 text-gray-600 leading-relaxed">
                                {jobData.responsibilities.map((responsibility, index) => (
                                    <li key={index} className="flex gap-3">
                                        <span className="text-gray-400 mt-2">•</span>
                                        <span>{responsibility}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Similar Jobs Sidebar */}
                    <div className="w-80">
                        <section className="sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Similar Jobs</h2>
                            <div className="space-y-4">
                                {SIMILAR_JOBS.map((job) => (
                                    <div key={job.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <div className="w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center">
                                                    <span className="font-semibold text-gray-800">{job.letter}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                                                    <div className="text-[15px] text-gray-600">
                                                        {job.company} • {job.location}
                                                    </div>
                                                    <div className="flex gap-6 mt-1 text-[15px] text-gray-500">
                                                        <span>{job.type}</span>
                                                        <span>{job.workplace}</span>
                                                        <span>{job.experience}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-2">
                                                        {job.time} • {job.applicants}
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
        </div>

    );
};

export default JobDetail;