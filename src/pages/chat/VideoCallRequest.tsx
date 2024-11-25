import { PhoneCall, X } from 'lucide-react';
import React, { useEffect } from 'react';

interface VideoCallRequestProps {
    fromUser: string;
    toUser: string;
    fromUserFullname: string;
    setShowCallRequestModal: any;
    handleRefuseCall: any;
}

const wsUrl = process.env.REACT_APP_BASE_WS_URL;

const VideoCallRequest: React.FC<VideoCallRequestProps> = ({ fromUser, toUser, fromUserFullname, setShowCallRequestModal, handleRefuseCall }) => {

    const acceptCallRequest = () => {
        setShowCallRequestModal(false);
        const windowFeatures = `menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes,width=${window.screen.width},height=${window.screen.height}`;
        const url = new URL(wsUrl + "/video-call");
        url.searchParams.set("fromUser", toUser);
        url.searchParams.set("toUser", fromUser);
        url.searchParams.set("isCallee", '1');
        window.open(url.toString(), "Video Call", windowFeatures);
    };

    const refuseCallRequest = () => {
        setShowCallRequestModal(false);
        handleRefuseCall();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-sm mx-auto animate-fade-in">
                <div className="mb-6 items-center justify-center text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{fromUserFullname}</h2>
                    <p className="text-gray-600">Bạn đang có cuộc gọi video</p>
                </div>

                <div className="flex items-center justify-center space-x-6">
                    <button
                        onClick={acceptCallRequest}
                        className="flex items-center justify-center bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <PhoneCall className="w-7 h-7" />
                    </button>
                    <button
                        onClick={refuseCallRequest}
                        className="flex items-center justify-center bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <X className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCallRequest;
