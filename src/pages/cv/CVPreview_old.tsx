import React from 'react';
import '../../styles/cv.css';
import Title from './CVTitle';

const CVPreview = React.forwardRef<HTMLDivElement>((props, ref) => {
    const avtUrl = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid';
    const backgroundImageUrl = '/assets/cv-bg-1.jpg';

    return (
        <div
            ref={ref}
            className="bg-white shadow-md rounded-lg overflow-hidden relative p-0 m-0"
            style={{
                width: '794px',   // A4 width for 96 PPI screens
                height: '1123px', // A4 height for 96 PPI screens
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
                margin: 0,        // Ensure no extra margin
                padding: 0,       // Ensure no extra padding
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
                        // crossOrigin='anonymous'
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
                        <h1 className="font-lg font-bold">Trương Quốc Việt</h1>
                        <p className="font-md font-semibold">Web Developer</p>
                    </div>
                    {/* Career Objective Section */}
                    <div className="mb-6 flex flex-col">
                        <Title title='Mục tiêu nghề nghiệp' />
                        <p>Ứng tuyển vào vị trí thực tập sinh để áp dụng kiến thức từ trường vào công việc thực tế. Mục tiêu dài hạn: trở thành kỹ sư DevOps.</p>
                    </div>

                    {/* Education Section */}
                    <div className="mb-6">
                        <Title title='Học vấn' />
                        <p> Ngành:Công Nghệ Thông Tin // 2020 - Hiện tại</p>
                        <p>Học viện Công nghệ Bưu Chính Viễn Thông (PTIT)</p>
                        <p>GPA: 3.35</p>
                        <p>Học bổng loại Giỏi kỳ 1 và kỳ 2 năm 3</p>
                    </div>

                    {/* Projects Section */}
                    <div className="mb-6">
                        <Title title='Dự án' />

                        <div className="mt-2">
                            <h3 className="font-semibold">Bookstore-eCommerce (4/2023 - 6/2023)</h3>
                            <p>Vị trí: Cá nhân | Công nghệ: MSSQL, Spring Boot, ReactJS + Redux</p>
                            <p>Mô tả: Trang web thương mại điện tử quản lý và bán sách online.</p>
                            <a href="https://github.com/Cutiepie4/Bookstore_eCommerce" className="text-blue-500">GitHub Link</a>
                        </div>

                        <div className="mt-2">
                            <h3 className="font-semibold">Haunted World - Game (9/2022 - 12/2022)</h3>
                            <p>Vị trí: Leader | Công nghệ: LibGDX Framework Java</p>
                            <p>Mô tả: Game RPG nhỏ dùng framework game 2D.</p>
                            <a href="https://github.com/Cutiepie4/HauntedWorld" className="text-blue-500">GitHub Link</a>
                        </div>

                        <div className="mt-2">
                            <h3 className="font-semibold">BTL-IoT (9/2023 - Hiện tại)</h3>
                            <p>Vị trí: Leader | Công nghệ: Flask, MongoDB, ReactJS, Arduino</p>
                            <p>Mô tả: Cửa hàng sách dùng RFID cho quản lý tồn kho và thanh toán.</p>
                            <a href="https://github.com/Cutiepie4/IoT_assignment" className="text-blue-500">GitHub Link</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CVPreview;
