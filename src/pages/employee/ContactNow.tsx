import { Mail, MessageCircleQuestion, PhoneCall } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';
import useAppDispatch from '../../hooks/useAppDispatch';
import { addMessage } from '../../redux/slice/messageSlice';
import { ChatMessage } from '../chat/Messenger';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import websocketService from '../../utils/WebSocketService'

interface Employer {
    userId: number,
    fullName: string | null;
    email: string | null;
    phoneNumber: string;
    avatar: string | null;
}

const ContactNow: React.FC<{ employer: Employer, jobId: number }> = ({ employer, jobId }) => {
    const { userId, fullName } = useSelector((state: RootState) => state.authReducer);
    const dispatch = useAppDispatch();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="text-center w-full">
                <h2 className="text-xl font-semibold text-gray-800">Liên hệ với nhà tuyển dụng</h2>
            </div>

            <div className="space-y-2 w-full">
                <button
                    className="space-x-2 flex items-center justify-center w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow-sm transition duration-200"
                    onClick={() => {
                        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${employer?.email}`, '_blank');
                    }}
                >
                    <Mail />
                    <span>{employer?.email}</span>
                </button>

                <button
                    className="space-x-2 flex items-center justify-center w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow-sm transition duration-200"
                    onClick={() => {
                        employer?.phoneNumber && navigator.clipboard.writeText(employer?.phoneNumber)
                            .then(() => {
                                toast.info('Đã sao chép số điện thoại');
                            })
                            .catch((err) => {
                                console.error('Failed to copy: ', err);
                            });
                    }}
                >
                    <PhoneCall />
                    <span>{employer?.phoneNumber ?? 'Không có thông tin'}</span>
                </button>

                <button
                    className="space-x-2 flex items-center justify-center w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow-sm transition duration-200"
                    onClick={() => {
                        const msg: ChatMessage = {
                            receiver: String(employer.userId),
                            status: 'MESSAGE',
                            id: null,
                            senderName: String(fullName),
                            direction: 'outgoing',
                            position: 'normal',
                            message: String(jobId),
                            sender: String(userId),
                            sentTime: new Date().toISOString(),
                            type: 'html',
                        };

                        employer
                            && dispatch(
                                addMessage({
                                    converId: employer?.userId,
                                    avtUrl: employer?.avatar,
                                    fullName: employer?.fullName ?? employer?.email ?? employer?.phoneNumber,
                                    msg,
                                    openMessenger: true
                                })
                            )
                            && websocketService.sendMessage(msg);
                    }}
                >
                    <MessageCircleQuestion />
                    <span>Nhắn tin</span>
                </button>
            </div>
        </div >
    );
};

export default ContactNow;
