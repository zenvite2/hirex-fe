import React, { useState, useEffect } from 'react';
import '../../styles/cv.css'

const CVPreview = () => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const avtUrl = 'https://s3.deploy-hirexptit.io.vn/hirex/images/1731423859557_wallpaperflare.com_wallpaper__1_.jpg';
    const backgroundImageUrl = '/assets/cv-bg-1.jpg';

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                const response = await fetch('http://localhost:8080/resumes/1');
                if (!response.ok) {
                    throw new Error('Failed to fetch resume data');
                }
                const data = await response.json();
                setResumeData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchResumeData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                        <h2 className="font-md font-semibold mb-1">Danh hiệu và Giải thưởng</h2>
                        <p>2022: Top 13 Giải khuyến khích ICPC PTIT</p>
                        <p>2023: Vào vòng Chung Kết ICPC PTIT 2023</p>
                    </div>

                    <div className="font-xs mb-4">
                        <h2 className="font-md font-semibold mb-1">Chứng chỉ</h2>
                        <p>2021: TOEIC 750</p>
                        <p>2021: Chứng chỉ Thuật toán và Ứng dụng Samsung</p>
                    </div>

                    {/* Skills */}
                    <div className="font-xs mb-4">
                        <h2 className="font-md font-semibold mb-1">Kỹ Năng</h2>
                        <p>Kỹ năng mềm: Giao tiếp, đọc tiếng Anh tốt, nghe mức vừa phải.</p>
                    </div>

                    {/* Interests */}
                    <div className="font-xs mb-4">
                        <h2 className="font-md font-semibold mb-1">Sở Thích</h2>
                        <p>Đi du lịch, chơi game, cầu lông</p>
                    </div>

                    {/* Additional Info */}
                    <div className="font-xs mb-4">
                        <h2 className="font-md font-semibold mb-1">Thông Tin Thêm</h2>
                        <p>Là người nhiệt huyết, có trách nhiệm với công việc, học hỏi và tiếp thu nhanh.</p>
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
                                {'Mục tiêu nghề nghiệp'}
                            </div>
                            <div className="border-b-2 border-gray-700 rounded-r-md"></div>
                        </div>
                        <p>{resumeData?.career || 'Ứng tuyển vào vị trí thực tập sinh để áp dụng kiến thức từ trường vào công việc thực tế. Mục tiêu dài hạn: trở thành kỹ sư DevOps.'}</p>
                    </div>

                    {/* Education Section */}
                    <div className="mb-6">
                        <div className="py-2 rounded-t-md w-full">
                            <div className="text-blue-800 font-bold mb-2 font-xmd">
                                {'Học vấn'}
                            </div>
                            <div className="border-b-2 border-gray-700 rounded-r-md"></div>
                        </div>
                        <p>Ngành: Công Nghệ Thông Tin // 2020 - Hiện tại</p>
                        <p>Học viện Công nghệ Bưu Chính Viễn Thông (PTIT)</p>
                        <p>GPA: 3.35</p>
                        <p>Học bổng loại Giỏi kỳ 1 và kỳ 2 năm 3</p>
                    </div>
                    {/* Projects Section */}
                    {resumeData?.projects && resumeData.projects.length > 0 && (
                        <div className="mb-6">
                            <div className="py-2 rounded-t-md w-full">
                                <div className="text-blue-800 font-bold mb-2 font-xmd">
                                    {'Dự án quan trọng'}
                                </div>
                                <div className="border-b-2 border-gray-700 rounded-r-md"></div>
                            </div>
                            {resumeData.projects.map((project) => (
                                <div key={project.id} className="mt-2">
                                    <h3 className="font-semibold font-md">{project.name}</h3>

                                    {(project.startDate || project.endDate) && (
                                        <p>
                                            Thời gian: {project.startDate} {project.startDate && project.endDate && '-'} {project.endDate}
                                        </p>
                                    )}

                                    {project.position && (
                                        <p>Vị trí: {project.position}</p>
                                    )}

                                    {project.description && (
                                        <p>Mô tả: {project.description}</p>
                                    )}

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