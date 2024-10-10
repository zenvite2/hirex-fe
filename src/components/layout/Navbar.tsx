import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReusableModal from "../common/ReusableModal";
import { Logo } from "../../assets";
import { ChevronDown, FileText, Heart, Send, Bell, LogOut, Settings, HelpCircle } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/authSlice';
import { RootState } from "../../redux/store";
interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployerPage = location.pathname.startsWith('/employer');

  const [isModalOpen, setModalOpen] = useState(false);
  const { token, role } = useSelector((state: RootState) => state.authReducer);
  const isLoggedIn = !!token;
  const dispatch = useDispatch();


  const isLinkActive = (path: string) => location.pathname === path;

  const getLinkClassName = (path: string) => {
    const baseClasses = "text-gray-700 hover:text-[#0069DB] hover:font-semibold transition duration-300";
    const activeClasses = "text-[#0069DB] font-semibold border-b-2 border-[#0069DB]";
    return `${baseClasses} ${isLinkActive(path) ? activeClasses : ''}`;
  };

  const handleRegisterEmployee = () => {
    setModalOpen(false);
    navigate("/register-employee");
  };

  const handleRegisterEmployer = () => {
    setModalOpen(false);
    navigate("/register-employer");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const renderUserDropdown = () => (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg hidden group-hover:block">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="My CareerLink Logo" className="w-12 h-12" />
          <div>
            <h3 className="font-semibold text-lg">HireX</h3>
            <p className="text-gray-500">Tài khoản</p>
          </div>
        </div>
      </div>
      <Link to="/resume" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
        <FileText className="mr-3" size={20} />
        <span>Hồ sơ xin việc</span>
      </Link>
      <Link to="/saved-jobs" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
        <Heart className="mr-3" size={20} />
        <span>Việc đã lưu</span>
      </Link>
      <Link to="/applied-jobs" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
        <Send className="mr-3" size={20} />
        <span>Việc đã ứng tuyển</span>
      </Link>
      <Link to="/job-alerts" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
        <Bell className="mr-3" size={20} />
        <span>Thông báo việc làm</span>
      </Link>
      <div className="border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-3" size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  const renderAdminDropdown = () => (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg hidden group-hover:block">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="TinaSoft Logo" className="w-12 h-12" />
          <div>
            <h3 className="font-semibold text-lg">TinaSoft</h3>
            <p className="text-gray-500">Chỉnh sửa hồ sơ của bạn</p>
          </div>
        </div>
      </div>
      <Link to="/account-settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
        <Settings className="mr-3" size={20} />
        <span>Cài đặt tài khoản</span>
      </Link>
      <Link to="/help-support" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
        <HelpCircle className="mr-3" size={20} />
        <span>Trợ giúp và hỗ trợ</span>
      </Link>
      <div className="border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-3" size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

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
              <Link to="/companies" className={getLinkClassName('/user-profile')}>
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
                className={`${getLinkClassName('/employer')} ${location.pathname.startsWith('/employer')
                  ? 'text-[#0069DB] font-semibold border-b-2 border-[#0069DB]'
                  : ''
                  }`}
              >
                Đăng việc làm
              </Link>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-2">
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-[#0069DB] transition duration-300 border rounded-full px-2 py-1 hover:border-[#0069DB]">
                <img src={Logo} alt="User Avatar" className="w-8 h-8 rounded-full" />
                <span className="font-medium">Quân Nguyễn</span>
                <ChevronDown size={16} />
              </button>
              {role === 'user' ? renderUserDropdown() : renderAdminDropdown()}
            </div>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="bg-[#0069DB] text-white px-3 py-2 rounded-md hover:bg-[#0050B3] transition duration-300"
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-white text-[#0069DB] border border-[#0069DB] px-3 py-2 rounded-md hover:bg-[#0069DB] hover:text-white transition duration-300"
              >
                Đăng Ký
              </button>
            </>
          )}
          <Link
            to={isEmployerPage ? "/find-jobs" : "/employer"}
            onClick={(e) => {
              e.preventDefault(); // Prevent the default link behavior
              handleLogout();     // Log out the user
              // After logging out, navigate to the appropriate page
              setTimeout(() => {
                navigate(isEmployerPage ? "/" : "/employer");
              }, 0);  // Use a slight delay to ensure logout finishes before navigation
            }}
            className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300 whitespace-nowrap"
          >
            {isEmployerPage ? "Tìm việc" : "Nhà tuyển dụng"}
          </Link>
        </div>
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Chọn loại tài khoản"
        footer={(
          <>
            <button
              className="bg-[#0069DB] text-white py-2 px-4 rounded-md hover:bg-[#0050B3] transition duration-300 w-full"
              onClick={handleRegisterEmployee}
            >
              Người tìm việc
            </button>
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-300 w-full mt-2"
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