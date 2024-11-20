import React, { useState, useEffect } from 'react';
import '../../styles/cv.css'
import useAppDispatch from '../../hooks/useAppDispatch';
import { resumeGet } from '../../services/resumeApi';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';

const CVPreview = () => {
    const dispatch = useAppDispatch();
    const [resumeData, setResumeData] = useState(null);

    const avtUrl = 'https://s3.deploy-hirexptit.io.vn/hirex/images/1731423859557_wallpaperflare.com_wallpaper__1_.jpg';
    const backgroundImageUrl = '/assets/cv-bg-1.jpg';

    useEffect(() => {
        const fetchResumeDetail = async () => {
            try {
                dispatch(startLoading());
                const result = await dispatch(resumeGet(1));
                dispatch(stopLoading());
                setResumeData(result?.payload?.response);
            } catch (err) {
                toast.error('Error loading job details');
            }
        };
        fetchResumeDetail();
    }, []);

    return (
        <div
            className="bg-white shadow-md rounded-lg overflow-hidden relative p-0 m-0"
            style={{
                width: '794px',
                height: '1123px',
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
                margin: 0,
                padding: 0,
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Sidebar (First Column) */}
                <div className="col-span-1 bg-gray-50 py-6 px-4 flex flex-col items-start bg-opacity-80 h-screen">
                    <div className="w-full flex justify-center items-center mb-4">
                        <img
                            className="bg-gray-300 w-full aspect-square rounded-md object-cover"
                            src={avtUrl}
                            alt="Avatar"
                        />
                    </div>

                    {/* Personal Information */}
                    <div className="mb-4 font-xs">
                        <h2 className="font-md font-semibold mb-1">Thông tin cá nhân</h2>
                        <p>✉ tqviet02.work@gmail.com</p>
                        <p>📞 0946745428</p>
                        <p>🌐 <a href="https://www.facebook.com/tqviet.02" className="text-blue-500">facebook.com/tqviet.02</a></p>
                        <p>📍 Mỗ Lao, Hà Đông, Hà Nội</p>
                        <p>GitHub: <a href="https://github.com/Cutiepie4" className="text-blue-500">github.com/Cutiepie4</a></p>
                    </div>

                    {/* Awards and Certifications */}
                    <div className="font-xs mb-4">
                        <h2 className="font-md font-semibold mb-1">Chứng chỉ</h2>
                        {resumeData?.certificates && resumeData.certificates.map((cert) => (
                            <div key={cert.id}>
                                <p>{cert.name}</p>
                                <p>
                                    {cert.startDate} - {cert.endDate}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="font-xs mb-4">
                        <h2 className="font-md font-semibold mb-1">Kỹ Năng</h2>
                        {resumeData?.skills && resumeData.skills.map((skill) => (
                            <p key={skill.id}>{skill.name}</p>
                        ))}
                    </div>

                    {/* Interests */}
                    <div className="font-xs mb-4">
                        <h2 className="font-md font-semibold mb-1">Sở Thích</h2>
                        <p>{resumeData?.hobby}</p>
                    </div>
                </div>

                {/* Main Content (Second Column) */}
                <div className="col-span-2 p-6 font-xs">
                    {/* Header Section */}
                    <div className="mb-6">
                        <h1 className="font-2xl font-bold">Trương Quốc Việt</h1>
                        <p className="font-md font-semibold">Web Developer</p>
                    </div>

                    {/* Career Objective Section */}
                    <div className="mb-6 flex flex-col">
                        <div className="py-2 rounded-t-md w-full">
                            <div className="text-blue-800 font-bold mb-2 font-xmd">
                                Mục tiêu nghề nghiệp
                            </div>
                            <div className="border-b-2 border-gray-700 rounded-r-md"></div>
                        </div>
                        <p>{resumeData?.career}</p>
                    </div>

                    {/* Education Section */}
                    <div className="mb-6">
                        <div className="py-2 rounded-t-md w-full">
                            <div className="text-blue-800 font-bold mb-2 font-xmd">
                                Học vấn
                            </div>
                            <div className="border-b-2 border-gray-700 rounded-r-md"></div>
                        </div>
                        {resumeData?.educations && resumeData.educations.map((edu) => (
                            <div key={edu.id}>
                                <p>Ngành: {edu.major} || {edu.startDate} - {edu.endDate}</p>
                                <p>{edu.name}</p>
                                <p>GPA: {edu.gpa}</p>
                            </div>
                        ))}
                    </div>

                    {/* Experience Section */}
                    {resumeData?.experiences && resumeData.experiences.length > 0 && (
                        <div className="mb-6">
                            <div className="py-2 rounded-t-md w-full">
                                <div className="text-blue-800 font-bold mb-2 font-xmd">
                                    Kinh Nghiệm Làm Việc
                                </div>
                                <div className="border-b-2 border-gray-700 rounded-r-md"></div>
                            </div>
                            {resumeData.experiences.map((exp) => (
                                <div key={exp.id} className="mt-2">
                                    <h3 className="font-semibold font-md">{exp.company}</h3>
                                    <p>Vị trí: {exp.position}</p>
                                    <p>Thời gian: {exp.startDate} - {exp.endDate}</p>
                                    <p>Mô tả: {exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects Section */}
                    {resumeData?.projects && resumeData.projects.length > 0 && (
                        <div className="mb-6">
                            <div className="py-2 rounded-t-md w-full">
                                <div className="text-blue-800 font-bold mb-2 font-xmd">
                                    Dự án quan trọng
                                </div>
                                <div className="border-b-2 border-gray-700 rounded-r-md"></div>
                            </div>
                            {resumeData.projects.map((project) => (
                                <div key={project.id} className="mt-2">
                                    <h3 className="font-semibold font-md">{project.name}</h3>
                                    <p>Thời gian: {project.startDate} - {project.endDate}</p>
                                    <p>Vị trí: {project.position}</p>
                                    <p>Mô tả: {project.description}</p>
                                    {project.link && (
                                        <p>
                                            Link: <a
                                                href={project.link}
                                                className="text-blue-500"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {project.link}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CVPreview;