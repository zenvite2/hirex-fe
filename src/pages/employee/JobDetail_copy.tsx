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
}

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
        setIsModalOpen(true);
    }

    const handleSubmit = (formData) => {
        console.log('Form submitted:', formData);
        toast.success('Application submitted successfully!');
        setIsModalOpen(false);
    };

    const handleSaveJob = () => {
        toast.success('Job saved successfully!');
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
                    </div>
                </div>
            </div>
            <ApplyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>

    );
};

export default JobDetail;