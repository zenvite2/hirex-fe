import { PhoneCall, X } from 'lucide-react';
import React, { useEffect } from 'react';

interface VideoCallRequestProps {
    fromUser: string;
    toUser: string;
    setShowCallRequestModal: any;
    handleRefuseCall: any;
}

const wsUrl = process.env.REACT_APP_BASE_WS_URL;

const VideoCallRequest: React.FC<VideoCallRequestProps> = ({ fromUser, toUser, setShowCallRequestModal, handleRefuseCall }) => {

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

    useEffect(() => {

    });

    return (
        <div className="flex items-center justify-center h-full w-full fixed inset-0 bg-black bg-opacity-50">
            <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 w-80 max-w-full text-center">
                <h2 className="text-lg font-semibold mb-2">{fromUser}</h2>
                <p className="text-md text-gray-700 mb-6">Bạn đang có cuộc gọi video</p>
                <div className="flex space-x-4">
                    <button
                        onClick={acceptCallRequest}
                        className="flex items-center justify-center bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition duration-300"
                    >
                        <PhoneCall className="w-6 h-6" />
                    </button>
                    <button
                        onClick={refuseCallRequest}
                        className="flex items-center justify-center bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition duration-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCallRequest;
