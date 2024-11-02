import React, { useCallback, useEffect, useRef, useState } from 'react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    Sidebar,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    ConversationList,
    Conversation,
    Avatar,
    ConversationHeader,
    VideoCallButton,
    TypingIndicator,
    MessageModel,
    MessageType,

} from "@chatscope/chat-ui-kit-react";
import { Client, Message as MessageStompjs, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CustomModal from '../../components/common/CustomModal';
import VideoCallRequest from './VideoCallRequest';
import { updateConversations } from '../../redux/slice/messageSlice';
import { getConversations } from '../../services/messageApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { uploadFile } from '../../services/fileUploadApi';
import { Inbox } from 'lucide-react';

const VIDEO_CALL_RESPONSE = {
    ACCEPT: 'VIDEO_CALL_RESPONSE_ACCEPT',
    REFUSE: 'VIDEO_CALL_RESPONSE_REFUSE'
} as const;

export const Status = {
    JOIN: 'JOIN',
    MESSAGE: 'MESSAGE',
    VIDEO_CALL_REQUEST: 'VIDEO_CALL_REQUEST',
    VIDEO_CALL_RESPONSE: VIDEO_CALL_RESPONSE
} as const;

export type StatusType =
    | typeof Status.JOIN
    | typeof Status.MESSAGE
    | typeof Status.VIDEO_CALL_REQUEST
    | typeof Status.VIDEO_CALL_RESPONSE.ACCEPT
    | typeof Status.VIDEO_CALL_RESPONSE.REFUSE;

export interface ChatMessage extends MessageModel {
    receiver: string;
    status: StatusType;
    fileUrl?: string;
}

export interface Conversation {
    id: number,
    name: string,
    avtUrl: string,
    last10Messages: ChatMessage[]
}

const wsUrl = process.env.REACT_APP_BASE_WS_URL;
let stompClient: Client | null = null;
let isConnected: Boolean = false;

const Messenger: React.FC = () => {
    const { userId, username } = useSelector((state: RootState) => state.authReducer);
    const { lstConvers } = useSelector((state: RootState) => state.messageReducer);
    const dispatch = useAppDispatch();
    const [toCaller, setToCaller] = useState<string>(null);
    const [currentConvers, setCurrentConversation] = useState<Conversation | null>(lstConvers[0] ?? null);
    const [lstCurrentMsg, setLstCurrentMsg] = useState<ChatMessage[]>([]);
    const [msgInput, setMsgInput] = useState<string>("");
    const [showCallRqModal, setShowCallRqModal] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isConnected) {
            dispatch(startLoading());
            connect();
        }
    }, []);

    useEffect(() => {
        isConnected && userId != null && dispatch(getConversations());
    }, [userId]);

    const fetchConversations = useCallback(() => {
        setLstCurrentMsg((lstConvers.length > 0 && currentConvers) ? lstConvers.find(item => item.id == currentConvers?.id)?.last10Messages ?? [] : []);
    }, [lstConvers, currentConvers]);

    useEffect(() => {
        isConnected && fetchConversations();
    }, [lstConvers, currentConvers]);

    useEffect(() => {
        if (lstConvers.length > 0 && currentConvers == null) {
            setCurrentConversation(prev => prev ?? lstConvers[0]);
        }
    }, [lstConvers]);

    const connect = () => {
        if (!isConnected) {
            const sock = new SockJS(wsUrl + '/ws');
            stompClient = over(sock);
            isConnected = true;
            stompClient.connect({}, onConnected, (e) => { dispatch(stopLoading()); toast.error('Mất kết nối tới máy chủ, vui lòng thử lại.'); });

            sock.onerror = () => {
                toast.error('Mất kết nối tới máy chủ, vui lòng thử lại.');
            }
        }
    };

    const onConnected = () => {
        dispatch(stopLoading());
        stompClient.subscribe('/user/' + userId + '/private', onReceive);
        const chatMessage: ChatMessage = {
            sender: userId + '',
            message: `${userId} connected to server.`,
            sentTime: new Date().toISOString(),
            receiver: '...',
            status: Status.JOIN,
            type: 'custom',
            direction: 'outgoing',
            position: 'normal'
        };
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
    };

    const onReceive = (payload: MessageStompjs) => {
        const payloadData: ChatMessage = { ...JSON.parse(payload.body), position: 'normal', direction: 'incoming' };
        updateReduxConversations(payloadData);
        if (payloadData.status == Status.VIDEO_CALL_REQUEST) {
            setShowCallRqModal(true);
            setToCaller(payloadData.sender);
        }
    };

    const updateReduxConversations = (chatMessage: ChatMessage) => {
        const updatedConversations = lstConvers.map(item =>
            item.id === currentConvers?.id
                ? { ...item, last10Messages: [...item.last10Messages, chatMessage] }
                : item
        );
        dispatch(updateConversations(updatedConversations));
    }

    const handleSendMessage = (type: MessageType, fileUrl?: string) => {
        fileUrl && console.log('sending file: ', fileUrl)
        if (stompClient) {
            if ((msgInput.trim() || fileUrl) && currentConvers) {
                const chatMessage: ChatMessage = {
                    sender: String(userId),
                    receiver: String(currentConvers?.id),
                    message: fileUrl ? '' : msgInput.trim(),
                    sentTime: new Date().toISOString(),
                    status: Status.MESSAGE,
                    direction: 'outgoing',
                    position: 'normal',
                    type: type,
                    fileUrl: fileUrl
                };

                updateReduxConversations(chatMessage);
                stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                setMsgInput("");
            }
        }
        else {
            toast.error("Mất kết nối tới máy chủ, vui lòng tải lại trang");
        }
    };

    const handleVideoCall = () => {
        const windowFeatures = `menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes,width=${window.screen.width},height=${window.screen.height}`;
        const url = new URL(wsUrl + "/video-call");
        url.searchParams.set("fromUser", userId + '');
        url.searchParams.set("toUser", currentConvers?.id + '');
        url.searchParams.set("isCallee", '0');
        window.open(url.toString(), "Video Call", windowFeatures);

        const chatMessage: ChatMessage = {
            sender: userId + '',
            receiver: currentConvers?.id + '',
            message: 'Đã yêu cầu cuộc gọi video.',
            sentTime: new Date().toISOString(),
            status: Status.VIDEO_CALL_REQUEST,
            direction: 'outgoing',
            position: 'normal',
            type: 'text'
        };
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
    };

    const handleRefuseCall = () => {
        const acceptPayload = {
            fromUser: userId,
            toUser: toCaller,
            status: VIDEO_CALL_RESPONSE.REFUSE,
        };
        stompClient.send("/app/accept", {}, JSON.stringify(acceptPayload));
    }

    const handleFileChosen = (event) => {
        const file: File = event.target.files[0];
        const fileType: MessageType = file.type.startsWith("image/") ? "image" : "custom";
        uploadFile(file)
            .then((url) => {
                if (url) {
                    handleSendMessage(fileType, url);
                }
            })
            .catch((error) => {
                toast.error('Có lỗi xảy ra khi tải file.');
            });
        event.target.value = '';
    };

    return (
        <div style={{ position: "relative", width: '100%' }}>
            {lstConvers.length > 0 ? <>
                <MainContainer responsive>
                    <Sidebar position="left">
                        <ConversationList>
                            {lstConvers?.length > 0 && lstConvers.map(conversation => (
                                <Conversation
                                    key={conversation.id}
                                    name={conversation.name}
                                    lastSenderName={conversation.name}
                                    info={conversation.last10Messages[conversation.last10Messages.length - 1]?.message ?? ''}
                                    active={currentConvers?.id === conversation.id}
                                    onClick={() => {
                                        setCurrentConversation(conversation);
                                        setToCaller(conversation.id + '');
                                    }}
                                >
                                    <Avatar src={conversation.avtUrl} name={conversation.name} />
                                </Conversation>
                            ))}
                        </ConversationList>
                    </Sidebar>

                    <ChatContainer>
                        {currentConvers && (
                            <ConversationHeader>
                                <Avatar src={currentConvers?.avtUrl} name={currentConvers?.name} />
                                <ConversationHeader.Content userName={currentConvers?.name} info="Online" />
                                <ConversationHeader.Actions>
                                    <VideoCallButton onClick={handleVideoCall} />
                                </ConversationHeader.Actions>
                            </ConversationHeader>
                        )}

                        <MessageList>
                            {lstCurrentMsg.map((msg: ChatMessage, index) => (
                                <Message
                                    key={index}
                                    model={{
                                        message: msg.type === 'text' ? msg.message : undefined,
                                        sentTime: new Date(msg.sentTime).toISOString(),
                                        sender: msg.sender,
                                        direction: msg.sender === userId + '' ? 'outgoing' : 'incoming',
                                        position: 'single',
                                        type: msg.type
                                    }}
                                >
                                    {msg.type === 'image' && <Message.ImageContent src={msg.fileUrl} />}
                                    {msg.type === "custom" && (
                                        <Message.CustomContent>
                                            <embed
                                                src={"https://docs.google.com/gview?embedded=true&url=" + msg.fileUrl}
                                                width="100%"
                                                height={'400px'}
                                                type="application/pdf"
                                            />
                                        </Message.CustomContent>
                                    )}
                                </Message>
                            ))}

                            {/* <TypingIndicator content={`${currentConvers?.name} is typing...`} /> */}
                        </MessageList>

                        <MessageInput
                            placeholder={`Type message to ${currentConvers?.name || "anonymous"}...`}
                            value={msgInput}
                            onChange={val => setMsgInput(val)}
                            onSend={() => { handleSendMessage('text') }}
                            onAttachClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                }
                            }}
                        />
                    </ChatContainer>
                </MainContainer>
            </> : <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                <div className="flex items-center mb-4">
                    <Inbox color="gray" className="mr-3" size={50} />
                </div>
                <p className="text-gray-400 text-lg font-medium">You don’t have any conversations</p>
            </div>}
            {showCallRqModal && <CustomModal isOpen={showCallRqModal} onClose={() => setShowCallRqModal(false)} width='large' height='large'>
                <VideoCallRequest fromUser={toCaller} toUser={userId + ''} setShowCallRequestModal={setShowCallRqModal} handleRefuseCall={handleRefuseCall} />
            </CustomModal>}
            <input
                type="file"
                accept="image/*,application/pdf"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChosen}
            />
        </div>
    );
};

export default Messenger;
