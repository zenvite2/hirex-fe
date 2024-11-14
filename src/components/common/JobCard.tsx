import { FaDollarSign } from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";
import { Building2, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';

interface Job {
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
  jobType: string;
  experience: string;
  salary: string;
}

interface JobCardProps {
  job: Job;
}

const handleSaveJob = () => {
  toast.success('Job saved successfully!');
  // Add your save job logic here
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
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
              <Building2 className="h-24 w-24 text-gray-400 mr-3" />
            )}
            <div>
              <h3 className="text-lg font-semibold truncate">{job.title}</h3>
              <p className="text-gray-500 text-sm">{job.companyName}</p>
            </div>
            <button
              onClick={handleSaveJob}
              className="ml-auto p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              <Bookmark className="ml-auto w-4 h-4" />
            </button>          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="bg-[#26d81d26] text-[#26d81d] py-1 px-2 rounded-md text-xs font-semibold">
                Full-Time
              </span>
            </div>
            <div className="flex items-center">
              <FaDollarSign className="text-gray-500 mr-1" />
              <span className="text-xs text-gray-600">{job.salary}</span>
            </div>
          </div>
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {job.companyDescription
              ? job.companyDescription
              : `${job.companyName} is hiring for the position of ${job.title} in ${job.location}.`
            }
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