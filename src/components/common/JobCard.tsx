import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";
import { Building2 } from 'lucide-react';

// Interface matching API response
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
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Link to={`/job-detail/${job.id}`}>
      <div
        className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5'
      >
        <div className='flex gap-3'>
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.companyName}`}
              className="h-12 w-12 object-contain"
            />
          ) : (
            <Building2 className="h-12 w-12 text-gray-400" />
          )}

          <div>
            <p className='text-lg font-semibold truncate'>{job.title}</p>
            <span className='flex gap-2 items-center'>
              <GoLocation className='text-slate-900 text-sm' />
              {job.district}, {job.city}
            </span>
          </div>
        </div>

        <div className='py-3'>
          <p className='text-sm'>
            {job.companyDescription
              ? job.companyDescription.slice(0, 150) + "..."
              : `${job.companyName} is hiring for the position of ${job.title} in ${job.location}.`
            }
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'>
            {job.companyName}
          </p>
          <span className='text-gray-500 text-sm'>
            {moment(job.createdAt).fromNow()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;