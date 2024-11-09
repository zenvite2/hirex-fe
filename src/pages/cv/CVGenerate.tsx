import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CVPreview from './CVPreview';
import { readFileSync } from 'fs';
import axiosIns from '../../services/axiosIns';

const CVGenerate = () => {

    // Function to export the CVPreview component to complete HTML
    const handleExportToHtml = async () => {

        // Full HTML document with necessary meta tags, Tailwind CDN, and embedded cv.css
        const fullHtml = `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>CV Preview</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
        }

        .cv-container {
            max-width: 800px;
            margin: 20px auto;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #ffffff;
            overflow: hidden;
        }

        .cv-grid {
            display: flex; /* Use flexbox for layout */
            flex-wrap: nowrap; /* Prevent wrapping */
        }

        .cv-sidebar {
            padding: 20px;
            background-color: #F9FAFB;
            width: 30%; /* Sidebar takes 30% of the width */
        }

        .cv-main {
            padding: 20px;
            width: 70%; /* Main content takes 70% of the width */
        }

        .cv-avatar {
            margin-bottom: 16px;
            width: 100%;
        }

        .cv-avatar-placeholder {
            width: 100%;
            padding-top: 100%; /* Creates a responsive square aspect ratio */
            background-color: #D1D5DB;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 5px;
        }

        /* Font Utilities */
        .font-xs {
            font-size: 12px;
        }

        .font-md {
            font-size: 16px;
        }

        .font-lg {
            font-size: 20px;
            font-weight: bold;
        }

        /* Margin Utilities */
        .cv-mb-4 {
            margin-bottom: 16px;
        }

        a {
            color: blue;
            text-decoration: underline;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .cv-grid {
                flex-direction: column; /* Stack vertically on small screens */
            }

            .cv-sidebar, .cv-main {
                width: 100%; /* Full width for both sections */
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
    <div class="cv-grid">
        <!-- Sidebar (First Column) -->
        <div class="cv-sidebar">
            <div class="cv-avatar">
                <div
                    class="cv-avatar-placeholder"
                    style="background-image: url('https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid');
                           background-size: cover; background-position: center; background-repeat: no-repeat;">
                </div>
            </div>

            <!-- Personal Information -->
            <div class="cv-mb-4 font-xs">
                <h2 class="font-md cv-font-semibold cv-mb-1">Thông tin cá nhân</h2>
                <p>✉ tqviet02.work@gmail.com</p>
                <p>📞 0946745428</p>
                <p>🌐 <a href="https://www.facebook.com/tqviet.02" class="text-blue-500">facebook.com/tqviet.02</a></p>
                <p>📍 Mỗ Lao, Hà Đông, Hà Nội</p>
                <p>GitHub: <a href="https://github.com/Cutiepie4" class="text-blue-500">github.com/Cutiepie4</a></p>
            </div>

            <!-- Awards and Certifications -->
            <div class="font-xs cv-mb-4">
                <h2 class="font-md cv-font-semibold cv-mb-1">Danh hiệu và Giải thưởng</h2>
                <p>2022: Top 13 Giải khuyến khích ICPC PTIT</p>
                <p>2023: Vào vòng Chung Kết ICPC PTIT 2023</p>
            </div>

            <div class="font-xs cv-mb-4">
                <h2 class="font-md cv-font-semibold cv-mb-1">Chứng chỉ</h2>
                <p>2021: TOEIC 750</p>
                <p>2021: Chứng chỉ Thuật toán và Ứng dụng Samsung</p>
            </div>

            <!-- Skills -->
            <div class="font-xs cv-mb-4">
                <h2 class="font-md cv-font-semibold cv-mb-1">Kỹ Năng</h2>
                <p>Kỹ năng mềm: Giao tiếp, đọc tiếng Anh tốt, nghe mức vừa phải.</p>
            </div>

            <!-- Interests -->
            <div class="font-xs cv-mb-4">
                <h2 class="font-md cv-font-semibold cv-mb-1">Sở Thích</h2>
                <p>Đi du lịch, chơi game, cầu lông</p>
            </div>

            <!-- Additional Info -->
            <div class="font-xs cv-mb-4">
                <h2 class="font-md cv-font-semibold cv-mb-1">Thông Tin Thêm</h2>
                <p>Là người nhiệt huyết, có trách nhiệm với công việc, học hỏi và tiếp thu nhanh.</p>
            </div>
        </div>

        <!-- Main Content (Second Column) -->
        <div class="cv-main font-xs">
            <!-- Header Section -->
            <div class="cv-mb-6">
                <h1 class="font-lg font-bold">Trương Quốc Việt</h1>
                <p class="font-md cv-font-semibold">Web Developer</p>
            </div>

            <!-- Career Objective Section -->
            <div class="cv-mb-6 flex flex-col">
                <h2 class="font-md">Mục tiêu nghề nghiệp</h2>
                <p>Ứng tuyển vào vị trí thực tập sinh để áp dụng kiến thức từ trường vào công việc thực tế. Mục tiêu dài hạn: trở thành kỹ sư DevOps.</p>
            </div>

            <!-- Education Section -->
            <div class="cv-mb-6">
                <h2 class="font-md">Học vấn</h2>
                <p> Ngành: Công Nghệ Thông Tin // 2020 - Hiện tại</p>
                <p>Học viện Công nghệ Bưu Chính Viễn Thông (PTIT)</p>
                <p>GPA: 3.35</p>
                <p>Học bổng loại Giỏi kỳ 1 và kỳ 2 năm 3</p>
            </div>

            <!-- Projects Section -->
            <div class="cv-mb-6">
                <h2 class="font-md">Dự án</h2>

                <div class="cv-mt-2">
                    <h3 class="cv-font-semibold font-sm">Bookstore-eCommerce (4/2023 - 6/2023)</h3>
                    <p>Vị trí: Cá nhân | Công nghệ: MSSQL, Spring Boot, ReactJS + Redux</p>
                    <p>Mô tả: Trang web thương mại điện tử quản lý và bán sách online.</p>
                    <a href="https://github.com/Cutiepie4/Bookstore_eCommerce" class="text-blue-500">GitHub Link</a>
                </div>

                <div class="cv-mt-2">
                    <h3 class="cv-font-semibold font-sm">Haunted World - Game (9/2022 - 12/2022)</h3>
                    <p>Vị trí: Leader | Công nghệ: LibGDX Framework Java</p>
                    <p>Mô tả: Game RPG nhỏ dùng framework game 2D.</p>
                    <a href="https://github.com/Cutiepie4/HauntedWorld" class="text-blue-500">GitHub Link</a>
                </div>

                <div class="cv-mt-2">
                    <h3 class="cv-font-semibold font-sm">BTL-IoT (9/2023 - Hiện tại)</h3>
                    <p>Vị trí: Leader | Công nghệ: Flask, MongoDB, ReactJS, Arduino</p>
                    <p>Mô tả: Cửa hàng sách dùng RFID cho quản lý tồn kho và thanh toán.</p>
                    <a href="https://github.com/Cutiepie4/IoT_assignment" class="text-blue-500">GitHub Link</a>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
        `;

        // Log the full HTML string to the console
        console.log(fullHtml);

        const generatePdf = async () => {
            try {
                const response = await axiosIns.post('/generate-cv',
                    fullHtml, // Send raw HTML string
                    {
                        responseType: 'blob',
                        headers: {
                            'Content-Type': 'text/html', // Changed from application/json
                            'Accept': 'application/pdf'
                        }
                    }
                );

                // Create a blob URL and trigger download
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'resume.pdf');
                document.body.appendChild(link);
                link.click();

                // Cleanup
                link.remove();
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error('PDF Generation Error:', error.response || error);
                // Handle error (show user message, etc.)
            }
        };

        generatePdf()
    };

    return (
        <div className="flex justify-center p-8 bg-gray-100 min-h-screen">
            <div className="w-full max-w-4xl">
                <CVPreview />
                {/* Button to export the CVPreview to HTML and log it */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleExportToHtml}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Export CV to HTML
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CVGenerate;
