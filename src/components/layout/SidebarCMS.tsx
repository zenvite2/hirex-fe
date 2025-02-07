import { NavLink } from "react-router-dom";
import {BarChart2, FileText, Users, Info, Bell} from 'lucide-react';

const sidebarItems = [
  // { to: "/dashboard", label: "Bảng tin", icon: <BarChart2 className="mr-4 h-6 w-6" /> },
  { to: "/cms/account-management", label: "Quản lý tài khoản", icon: <Users className="mr-4 h-6 w-6" /> },
  { to: "/cms/browse-job", label: "Quản lý tin tuyển dụng", icon: <FileText className="mr-4 h-6 w-6" /> },
  { to: "/cms/notification", label: "Quản lý thông báo", icon: <Bell className="mr-4 h-6 w-6" /> },
  // { to: "/info-page", label: "Xem trang thông tin", icon: <Info className="mr-4 h-6 w-6" /> }
];

const SidebarCMS = () => {
  return (
    <aside className="w-64 bg-white p-4 shadow-md" style={{ position: "fixed", top: "60px", left: 0, height: "100vh" }}>
      <h2 className="text-lg font-semibold mb-4">CMS</h2>
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.to} className="py-2"> {/* Thêm py-2 để tạo khoảng cách trên dưới */}
              <NavLink
                to={item.to}
                className="flex items-center"
                style={({ isActive }) => ({
                  color: isActive ? 'green' : 'black',
                })}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarCMS;
