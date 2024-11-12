import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import axiosIns from '../services/axiosIns';

interface NotificationType {
  id: number;
  title: string;
  content: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Hàm fetch notifications từ API
  const fetchNotifications = async () => {
    try {
      const response = await axiosIns.get(`/notifications/13`);
      const fetchedNotifications: NotificationType[] = response.data.data;

      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(noti => !noti.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Dùng setInterval để gọi lại API mỗi 30 giây
  useEffect(() => {
    fetchNotifications(); // Gọi ngay khi component mount

    const interval = setInterval(() => {
      fetchNotifications(); // Gọi liên tục mỗi 30 giây
    }, 300000); // 30 giây

    // Cleanup để hủy setInterval khi component unmount
    return () => clearInterval(interval);
  }, []);

  // Xử lý khi click vào thông báo
  const handleNotificationClick = async (notificationId: number) => {
    try {
      // Đánh dấu thông báo đã đọc
      await axiosIns.patch(`/notifications/mark-read/13`);

      // Cập nhật trạng thái local
      const updatedNotifications = notifications.map(noti =>
        noti.id === notificationId ? { ...noti, read: true } : noti
      );

      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(noti => !noti.read).length);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleToggleNotifications = () => {
    setIsOpen(!isOpen);
    if (unreadCount > 0) {
      // Đánh dấu tất cả thông báo đã đọc khi mở
      axiosIns.patch(`/notifications/mark-read/13`);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex space-x-2 text-gray-600 hover:text-blue-600 relative mr-1"
        onClick={handleToggleNotifications}
      >
        <Bell size={20} />

        {/* Hiển thị số lượng thông báo chưa đọc */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Danh sách thông báo hiển thị khi click */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
          <ul className="p-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`
                  text-gray-700 
                  p-2 
                  rounded-md 
                  cursor-pointer 
                  ${!notification.read ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-100'}
                `}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="font-bold text-sm">{notification.title}</div>
                <div className="text-xs text-gray-600 truncate">
                  {notification.content.length > 50
                    ? `${notification.content.slice(0, 50)}...`
                    : notification.content
                  }
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
