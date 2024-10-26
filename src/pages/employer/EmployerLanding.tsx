import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { Job } from "../../assets";

const EmployerLanding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useSelector((state: RootState) => state.authReducer);

  const handlePostJob = () => {
    if (isLoggedIn && role === 'EMPLOYER') {
      navigate('/job-posts');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center mb-16 justify-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Giúp việc tuyển dụng<br />
                lần tới trở nên tốt hơn.<br />
                Nhanh chóng.
              </h1>
              <button 
                onClick={handlePostJob}
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold mt-4 hover:bg-blue-700 transition duration-300"
              >
                Đăng việc làm
              </button>
            </div>
            <div className="md:w-1/2">
              <img 
                src={Job}
                alt="Tuyển dụng trực tuyến" 
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Tạo tài khoản miễn phí của bạn",
                description: "Tất cả những gì bạn cần là địa chỉ email để tạo tài khoản và bắt đầu tạo bài đăng việc làm của mình."
              },
              {
                number: "2",
                title: "Tạo bài đăng việc làm của bạn",
                description: "Sau đó chỉ cần thêm chức danh, mô tả và địa điểm vào bài đăng việc làm của bạn, và bạn đã sẵn sàng tuyển dụng."
              },
              {
                number: "3",
                title: "Đăng việc làm của bạn",
                description: "Sau khi đăng việc làm, hãy sử dụng các công cụ hiện đại của chúng tôi để giúp bạn tìm thấy nhân tài mong muốn."
              }
            ].map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-4">{step.number}</div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h2>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerLanding;