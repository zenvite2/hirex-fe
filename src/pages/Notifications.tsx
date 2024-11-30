import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import useAppDispatch from '../hooks/useAppDispatch';
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '../services/notificationApi';
import CustomModal from '../components/common/CustomModal';

const Notifications: React.FC = () => {
    const { userId } = useSelector((state: RootState) => state.authReducer);
    const { notifications, unreadCount } = useSelector(
        (state: RootState) => state.notificationReducer
    );
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [showNotificationDetailModal, setShowNotificationDetailModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(
        useCallback(() => {
            dispatch(fetchNotifications(userId));
        }, [userId]),
        []
    );

    const handleNotificationClick = async (notificationId: number) => {
        const notification = notifications.find((n) => n.id === notificationId);
        setSelectedNotification(notification);
        dispatch(markNotificationAsRead({ userId, notificationId }));
        setShowNotificationDetailModal(true);
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
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 relative"
                onClick={handleToggleNotifications}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="py-4 px-3">
                            <div className="font-bold text-gray-800 mb-3 border-b pb-1 text-red-500">Thông báo</div>
                            {notifications.map((notification) => (
                                <div
                                    key={notification?.id}
                                    className={`text-gray-700 p-3 rounded-md cursor-pointer ${!notification?.read ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-100'
                                        }`}
                                    onClick={() => handleNotificationClick(notification?.id)}
                                >
                                    <div className="font-bold text-sm">{notification?.title}</div>
                                    <div className="text-xs text-gray-600 truncate">
                                        {notification?.content.length > 50
                                            ? `${notification?.content.slice(0, 50)}...`
                                            : notification?.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-4 text-center text-gray-500">Không có thông báo nào</div>
                    )}
                </div>
            )}

            {selectedNotification && (
                <CustomModal
                    height="small"
                    width="small"
                    isOpen={showNotificationDetailModal}
                    onClose={() => setShowNotificationDetailModal(false)}
                >
                    {selectedNotification && (
                        <CustomModal
                            height="small"
                            width="small"
                            isOpen={showNotificationDetailModal}
                            onClose={() => setShowNotificationDetailModal(false)}
                        >
                            <div>
                                {/* Title Section */}
                                <h2 className="text-xl font-bold text-red-500">Chi tiết thông báo</h2>
                                <hr className="my-2 border-gray-300" />

                                {/* Content Block */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        {selectedNotification.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{selectedNotification.content}</p>
                                </div>

                                {/* Action Button */}
                                <div className="text-right mt-4">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                                        onClick={() => setShowNotificationDetailModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </CustomModal>
                    )}

                </CustomModal>
            )}
        </div>
    );
};

export default Notifications;
