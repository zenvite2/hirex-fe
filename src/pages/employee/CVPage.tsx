import React from 'react';
import { Camera } from 'lucide-react';

const CVPage: React.FC = () => {
  return (
    <div className="bg-[#23395d] text-white p-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-[#14b8a6] rounded-full p-3">
            <Camera size={36} />
          </div>
          <h1 className="text-2xl font-bold">Quản Nguyên</h1>
        </div>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-[#6c63ff] rounded-md">Sao chép liên kết</button>
          <button className="px-4 py-2 bg-[#ff3d00] rounded-md">Đăng nhập CV</button>
          <button className="px-4 py-2 bg-[#ff3d00] rounded-md">Tải xuống CV</button>
        </div>
      </header>

      <main className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold">THÔNG TIN CÁ NHÂN</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span>Giới tính:</span>
              <span>Khác</span>
            </div>
            <div className="flex justify-between">
              <span>Ngày sinh:</span>
              <span>843927736900</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>quanbanthu@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span>Quốc gia:</span>
              <span>-</span>
            </div>
            <div className="flex justify-between">
              <span>Tỉnh/thành phố:</span>
              <span>-</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">GIỚI THIỆU BẢN THÂN</h2>
          <p className="mt-4">
            Giới thiệu bản thân và mục tiêu nghề nghiệp
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">KHÓA HỌC/CHỨNG CHỈ</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span>Tên khóa học/Chứng chỉ</span>
              <span>Ngày bắt đầu - Ngày kết thúc</span>
            </div>
            <div className="flex justify-between">
              <span>Mô tả</span>
              <span>Mô tả về khóa học của bạn</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CVPage;  