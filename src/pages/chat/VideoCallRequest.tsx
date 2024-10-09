import React from 'react'

interface VideoCallRequestProps {
    fromUser: string;
    toUser: string;
    setShowCallRequestModal: any;
    handleRefuseCall: any;
}

const VideoCallRequest: React.FC<VideoCallRequestProps> = ({ fromUser, toUser, setShowCallRequestModal, handleRefuseCall }) => {

    const acceptCallRequest = () => {
        setShowCallRequestModal(false);
        const windowFeatures = `menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes,width=${window.screen.width},height=${window.screen.height}`;
        const url = new URL("https://192.168.1.123:8888/video-call");
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
        <div>
            <h4>Video call request from {fromUser}</h4>
            <h4>you are {toUser}</h4>
            <button onClick={acceptCallRequest}>
                ACCEPT
            </button>

            <button onClick={refuseCallRequest}>
                REFUSE
            </button>
        </div>
    )
}

export default VideoCallRequest