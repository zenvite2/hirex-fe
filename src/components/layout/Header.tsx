import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Heart, Send, Bell, User } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <header className="bg-gray-100 py-2 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex space-x-6">
          <NavLink 
            to="/my-careerlink"
            className={`flex items-center space-x-2 text-gray-600 hover:text-blue-600`}
          >
            <FileText size={20} />
            <span>My CareerLink</span>
          </NavLink>
          
          <NavLink 
            to="/ho-so"
            className={`flex items-center space-x-2 ${activeTab === 'ho-so' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
          >
            <FileText size={20} />
            <span>Hồ sơ xin việc (0)</span>
          </NavLink>
          
          <NavLink 
            to="/viec-da-luu"
            className={`flex items-center space-x-2 text-gray-600 hover:text-blue-600`}
          >
            <Heart size={20} />
            <span>Việc đã lưu (0)</span>
          </NavLink>
          
          <NavLink 
            to="/viec-da-ung-tuyen"
            className={`flex items-center space-x-2 text-gray-600 hover:text-blue-600`}
          >
            <Send size={20} />
            <span>Việc đã ứng tuyển (0)</span>
          </NavLink>
          
          <NavLink 
            to="/thong-bao"
            className={`flex items-center space-x-2 text-gray-600 hover:text-blue-600`}
          >
            <Bell size={20} />
            <span>Thông báo việc làm (0)</span>
          </NavLink>
        </div>
        
        <NavLink 
          to="/tai-khoan"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
        >
          <User size={20} />
          <span>Tài khoản</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Header;