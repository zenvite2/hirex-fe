import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import useAppDispatch from '../hooks/useAppDispatch';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationApi';

const Notifications: React.FC = () => {
    const { userId } = useSelector((state: RootState) => state.authReducer);
    const { notifications, unreadCount } = useSelector(
        (state: RootState) => state.notificationReducer
    );
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(
        useCallback(() => {
            dispatch(fetchNotifications(userId));
        }, [userId]), []);

    const handleNotificationClick = async (notificationId: number) => {
        dispatch(markNotificationAsRead({ userId, notificationId }));
    };

    const handleToggleNotifications = () => {
        setIsOpen(!isOpen);
        if (unreadCount > 0) {
            dispatch(markAllNotificationsAsRead(userId));
        }
    };

    return (
        <div className="relative inline-block">
            <button
                className="flex space-x-2 text-gray-600 hover:text-blue-600 relative mr-1"
                onClick={handleToggleNotifications}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="py-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`text-gray-700 p-2 rounded-md cursor-pointer ${!notification.read ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-100'}`}
                                    onClick={() => handleNotificationClick(notification.id)}
                                >
                                    <div className="font-bold text-sm">{notification.title}</div>
                                    <div className="text-xs text-gray-600 truncate">
                                        {notification.content.length > 50
                                            ? `${notification.content.slice(0, 50)}...`
                                            : notification.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-4 text-center text-gray-500">Không có thông báo nào</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;