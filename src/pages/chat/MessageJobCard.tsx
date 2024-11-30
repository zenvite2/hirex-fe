import React, { useEffect, useState } from "react";
import { getFullJobById } from "../../services/jobApi";
import { MessageCircle, Briefcase, MapPin, Building2, Clock } from 'lucide-react'

interface MessageJobCardProps {
    jobId: number;
}

interface MessageJobCardData {
    id: number;
    title: string;
    companyLogo: string;
    companyName: string;
    district: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
    jobType: {
        id: number;
        name: string;
    };
}

const MessageJobCard: React.FC<MessageJobCardProps> = ({ jobId }) => {
    const [job, setJob] = useState<MessageJobCardData>(null);

    useEffect(() => {
        const fetchFullJobData = async () => {
            const res = await getFullJobById(jobId);
            res && setJob(res);
        }

        fetchFullJobData();
    }, []);

    const handleMessageClick = () => {
        const currentOrigin = window.location.origin;
        const newUrl = `${currentOrigin}/job-detail/${job.id}`;
        window.open(newUrl, '_blank');
    };

    return (
        <div className="flex items-start space-x-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-300"
            onClick={handleMessageClick}
        >
            {/* Company Logo */}
            <div className="flex-shrink-0">
                <img
                    src={job?.companyLogo}
                    alt={`${job?.companyName} logo`}
                    className="w-16 h-16 rounded-md object-cover ring-2 ring-gray-100"
                />
            </div>

            {/* Job Details */}
            <div className="flex flex-col space-y-1 flex-grow">
                <div className="flex items-center text-gray-500 text-sm">
                    <MessageCircle className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Bạn đang trao đổi với nhà tuyển dụng về công việc này</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-1 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                    {job?.title}
                </h3>

                <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                    {job?.companyName}
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {job?.district.name} - {job?.city.name}
                </div>

                <div className="flex items-center text-blue-600 font-medium">
                    <Clock className="h-4 w-4 mr-2 text-blue-400" />
                    {job?.jobType.name}
                </div>
            </div>
        </div>
    );
};

export default MessageJobCard;
