import React from 'react';
import { Plus, Mail } from 'lucide-react';
import { Link } from 'react-router-dom'; // Thêm import này
const ResumeContent: React.FC = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hồ sơ xin việc</h2>
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            {/* <FileText size={48} className="text-gray-400" /> */}
          </div>
          <p className="text-gray-600 mb-4">
            Xin hãy chọn nút "Tạo hồ sơ mới" để tạo hồ sơ cho bạn.
          </p>
          <Link 
            to="/login" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center mx-auto w-fit"
          >
            <Plus size={20} className="mr-2" />
            Tạo hồ sơ mới
          </Link>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Thư xin việc ( 0 )</h2>
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <Mail size={48} className="text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">
            Bạn chưa có thư xin việc nào.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center mx-auto">
            <Plus size={20} className="mr-2" />
            Tạo thư mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeContent;