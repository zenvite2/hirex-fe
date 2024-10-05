import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import ReusableModal from "./ReusableModal";
import { Logo } from "../assets";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const isEmployerPage = location.pathname.startsWith('/employer');
  
  const [isModalOpen, setModalOpen] = useState(false);

  const isLinkActive = (path: string) => location.pathname === path;

  const getLinkClassName = (path: string) => {
    const baseClasses = "text-gray-700 hover:text-green-600 hover:font-semibold transition duration-300";
    const activeClasses = "text-green-600 font-semibold border-b-2 border-green-600";
    return `${baseClasses} ${isLinkActive(path) ? activeClasses : ''}`;
  };

  const handleLoginRedirect = () => {
    navigate("/login"); 
  };

  const handleRegisterEmployee = () => {
    setModalOpen(false);
    navigate("/register-employee");
  };

  const handleRegisterEmployer = () => {
    setModalOpen(false);
    navigate("/register-employer");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex-shrink-0">
            <img src={Logo} alt="TopCV Logo" className="h-8 w-auto" />
          </Link>
          {!isEmployerPage ? (
            <div className="hidden lg:flex space-x-6 ml-10">
              <Link to="/find-jobs" className={getLinkClassName('/find-jobs')}>
                Việc làm
              </Link>
              <Link to="/user-profile" className={getLinkClassName('/user-profile')}>
                Hồ sơ & CV
              </Link>
              <Link to="/companies" className={getLinkClassName('/companies')}>
                Công ty
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex space-x-6 ml-10">
              <Link 
                to="/employer" 
                className={`${getLinkClassName('/employer')} ${location.pathname.startsWith('/employer') ? 'text-green-600 font-semibold border-b-2 border-green-600' : ''}`}
              >
                Đăng việc làm
              </Link>
            </div>
          )}
        </div>
        <div className="hidden lg:flex items-center space-x-2">
          <>
            <button
              onClick={() => setModalOpen(true)}
              className="text-green-600 hover:text-green-700 font-medium px-3 py-2"
            >
              Đăng Ký
            </button>
            <button
              onClick={handleLoginRedirect} 
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Đăng Nhập
            </button>
          </>
          <Link
            to={isEmployerPage ? "/" : "/employer"}
            className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300 whitespace-nowrap"
          >
            {isEmployerPage ? "Tìm việc" : "Nhà tuyển dụng"}
          </Link>
        </div>
      </div>

      {/* Sử dụng modal tái sử dụng */}
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Chọn loại tài khoản"
        footer={(
          <>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 w-full"
              onClick={handleRegisterEmployee} 
            >
              Người tìm việc
            </button>
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-300 w-full"
              onClick={handleRegisterEmployer}               
            >
              Nhà tuyển dụng
            </button>
          </>
        )}
      >
        <p>Bạn muốn đăng ký với tư cách là:</p>
      </ReusableModal>
    </nav>
  );
};

export default Navbar;
