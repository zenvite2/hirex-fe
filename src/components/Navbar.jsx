import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Logo } from "../assets";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic here
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex-shrink-0">
            <img src={Logo} alt="TopCV Logo" className="h-8 w-auto" />
          </Link>
          <div className="hidden lg:flex space-x-6 ml-10">
            <Link to="/find-jobs" className="text-gray-700 hover:text-green-600">Việc làm</Link>
            <Link to="/user-profile" className="text-gray-700 hover:text-green-600">Hồ sơ & CV</Link>
            <Link to="/companies" className="text-gray-700 hover:text-green-600">Công ty</Link>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-2">
          {user?.token ? (
            <>
              <Link to="/user-profile" className="text-green-600 hover:text-green-700 font-medium px-3 py-2">
                Đăng Ký
              </Link>
              <button
                onClick={handleLogout}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-300"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/user-auth" className="text-green-600 hover:text-green-700 font-medium px-3 py-2">
                Đăng nhập
              </Link>
              <Link
                to="/user-auth"
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-300"
              >
                Đăng ký
              </Link>
            </>
          )}
          <Link
            to="/upload-job"
            className="bg-gray-800 text-white px-3 py-2 rounded-md hover:bg-gray-900 transition duration-300 whitespace-nowrap"
          >
            Nhà tuyển dụng
          </Link>
        </div>
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white px-4 py-2">
          <Link to="/find-jobs" className="block py-2 text-gray-700">Việc làm</Link>
          <Link to="/user-profile" className="block py-2 text-gray-700">Hồ sơ & CV</Link>
          <Link to="/companies" className="block py-2 text-gray-700">Công ty</Link>
          <Link to="/tools" className="block py-2 text-gray-700">Công cụ</Link>
          <Link to="/career-guide" className="block py-2 text-gray-700">Cẩm nang nghề nghiệp</Link>
          {user?.token ? (
            <>
              <Link to="/user-profile" className="block py-2 text-green-600">Hồ sơ</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/user-auth" className="block py-2 text-green-600">Đăng nhập</Link>
              <Link to="/user-auth" className="block py-2 text-green-600">Đăng ký</Link>
            </>
          )}
          <Link to="/upload-job" className="block py-2 text-gray-700">Đăng tuyển & tìm hồ sơ</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;