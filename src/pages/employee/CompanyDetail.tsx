import React, { useState, useEffect } from 'react';
import { MapPin, Users, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react';
import CommentCard from './Comment';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Link, useParams } from 'react-router-dom';
import axiosIns from '../../services/axiosIns';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';

interface JobDetail {
  responsibilities: string[];
  description: string[];
}

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string | null;
  location: string;
  yearExperience: number;
  salary: number;
  tech: number;
  city: number;
  district: number;
  position: number;
  jobType: number;
  contractType: number;
  deadline: string;
  status: string | null;
  jobDetails: JobDetail;
  createdAt: string;
  updatedAt: string;
}

interface CompanyData {
  id: number;
  employerId: number;
  companyName: string;
  description: string;
  website: string;
  logo: string;
  address: string;
  city: string;
  district: string;
  scale: string;
  jobs: Job[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const CompanyDetail = () => {
  const { id } = useParams();
  const { userId, username, isLoggedIn } = useSelector((state: RootState) => state.authReducer);
  // Cập nhật phần fetch data trong component:
  const [company, setCompany] = useState<CompanyData | null>(null);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        dispatch(startLoading());
        const response = await axiosIns.get<ApiResponse<CompanyData>>(`/company/${id}`);
        if (response.data.success) {
          setCompany(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        dispatch(stopLoading());
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Company not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Banner Image Section */}
        <div className="relative w-full h-40 bg-gradient-to-r from-cyan-700 to-blue-900">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-700/60 to-blue-900/60" />

          <div className="absolute top-4 right-4">
            <img src={company?.logo} alt={company?.companyName} className="h-8 object-contain" />
          </div>
        </div>

        {/* Company Info Bar */}
        <div className="relative bg-white shadow-md">
          <div className="px-6 py-3 flex items-center">
            <div className="w-24 h-24 bg-white rounded-lg shadow-lg -mt-12 flex items-center justify-center p-2">
              <img
                src={company?.logo}
                alt="Logo"
                className="w-20 h-20 object-contain"
              />
            </div>

            <div className="ml-6 flex-grow">
              <h1 className="text-2xl font-bold text-gray-900">{company?.companyName}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{company?.district}, {company?.city}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span>{company?.scale ? `${company.scale} nhân viên` : `Không có thông tin`}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* About Company Card */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">Về công ty</h2>
                  <p className="mt-4 text-gray-600">{company?.description}</p>
                  <div className="mt-4">
                    <a
                      href={company?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Website: {company?.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Jobs Card */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">Việc đang tuyển</h2>
                  <div className="mt-4 space-y-4">
                    {company?.jobs.length > 0 ? company?.jobs.map((job) => (
                      <Link
                        key={job.id}
                        to={`/job-detail/${job.id}`}
                        className="block border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 cursor-pointer"
                      >
                        <h3 className="text-lg font-semibold text-blue-600">{job.title}</h3>
                        <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.yearExperience} năm kinh nghiệm</span>
                          <span className="ml-auto">
                            Cập nhật: {new Date(job.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    )) : <h2 className='text-gray-400 text-xs'>Không tìm thấy công việc</h2>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <div>
                    <CommentCard companyId={Number(id)} userId={userId} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Website Link Card */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">Thông tin liên hệ</h2>
                  <div className="mt-4">
                    <a
                      href={company?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                      <span className="underline">{company?.website}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;