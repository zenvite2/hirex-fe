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
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addMessage, selectCurrentConver, setCurrentIndex, setToCaller, updateConverInfo } from '../../redux/slice/messageSlice';
import { getConversations } from '../../services/messageApi';
import useAppDispatch from '../../hooks/useAppDispatch';
import { uploadFile } from '../../services/fileUploadApi';
import { Inbox } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import websocketService from '../../utils/WebSocketService'
import MessageJobCard from './MessageJobCard';
import { getUserInfo, UserInfo } from '../../services/authApi';

export const VIDEO_CALL_RESPONSE = {
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
    id: string;
    senderName: string;
}

export interface Conversation {
    userId: number,
    username: string,
    fullName: string,
    avtUrl: string,
    last10Messages: ChatMessage[],
    companyName?: string,
}

const wsUrl = process.env.REACT_APP_BASE_WS_URL;

const Messenger: React.FC = () => {
    const { userId, username, fullName } = useSelector((state: RootState) => state.authReducer);
    const dispatch = useAppDispatch();
    const currentConver = useSelector(selectCurrentConver);
    const [msgInput, setMsgInput] = useState<string>("");
    const fileInputRef = useRef(null);
    const { lstConvers } = useSelector((state: RootState) => state.messageReducer);

    useEffect(() => {
        userId != null && lstConvers.length == 0 && dispatch(getConversations());
    }, []);

    const getConverInfo = useCallback(async (currentConver: Conversation) => {
        if (currentConver && currentConver.userId && (!currentConver.companyName || !currentConver.fullName || !currentConver.avtUrl)) {
            const userData: UserInfo = await getUserInfo(currentConver.userId);
            dispatch(updateConverInfo({ converId: currentConver.userId, avtUrl: userData.avatar, fullName: userData.fullName, companyName: userData.companyName }));
        }
    }, []);

    useEffect(() => {
        if (userId != null && currentConver) {
            getConverInfo(currentConver);
        }
    }, [userId, currentConver, getConverInfo]);

    const handleSendMessage = useCallback((type: MessageType, fileUrl?: string) => {
        if ((msgInput.trim() || fileUrl) && currentConver) {
            const chatMessage: ChatMessage = {
                sender: String(userId),
                receiver: String(currentConver.userId),
                message: fileUrl ? '' : msgInput.trim(),
                sentTime: new Date().toISOString(),
                status: Status.MESSAGE,
                direction: 'outgoing',
                position: 'normal',
                type,
                fileUrl,
                id: uuidv4(),
                senderName: fullName ?? username
            };

            updateLstConvers(chatMessage);
            websocketService.sendMessage(chatMessage);
            setMsgInput("");
        }
    }, [currentConver, msgInput, userId]);

    const updateLstConvers = useCallback((chatMessage: ChatMessage) => {
        const converUserIdReceived = Number(Number(chatMessage.sender) === userId ? chatMessage.receiver : chatMessage.sender);
        dispatch(addMessage({ converId: converUserIdReceived, msg: chatMessage }));
    }, [userId]);

    const handleVideoCall = () => {
        const windowFeatures = `menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes,width=${window.screen.width},height=${window.screen.height}`;
        const url = new URL(wsUrl + "/video-call");
        url.searchParams.set("fromUser", userId + '');
        url.searchParams.set("toUser", currentConver?.userId + '');
        url.searchParams.set("isCallee", '0');
        window.open(url.toString(), "Video Call", windowFeatures);

        const chatMessage: ChatMessage = {
            sender: String(userId),
            receiver: String(currentConver?.userId),
            message: 'Đã yêu cầu cuộc gọi video.',
            sentTime: new Date().toISOString(),
            status: Status.VIDEO_CALL_REQUEST,
            direction: 'outgoing',
            position: 'normal',
            type: 'text',
            id: uuidv4(),
            senderName: fullName ?? username
        };
        websocketService.sendMessage(chatMessage);
    };

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
                            {lstConvers.map(conversation => (
                                <Conversation
                                    key={conversation.userId}
                                    name={conversation.fullName ?? conversation.username}
                                    lastSenderName={conversation.last10Messages[conversation.last10Messages.length - 1].sender == String(userId)
                                        ? fullName ?? username
                                        : conversation.fullName}
                                    info={conversation.last10Messages[conversation.last10Messages.length - 1].type == 'html'
                                        ? conversation.last10Messages[conversation.last10Messages.length - 1].message && 'Đã gửi một liên kết công việc'
                                        : (conversation.last10Messages[conversation.last10Messages.length - 1].type == 'image'
                                            ? 'Đã gửi một ảnh'
                                            : conversation.last10Messages[conversation.last10Messages.length - 1].type == 'custom'
                                                ? 'Đã gửi một file'
                                                : conversation.last10Messages[conversation.last10Messages.length - 1]?.message ?? '')}
                                    active={currentConver?.userId === conversation.userId}
                                    onClick={() => {
                                        dispatch(setCurrentIndex(conversation.userId));
                                        setToCaller({
                                            id: conversation.userId + '',
                                            fullname: conversation.username
                                        });
                                    }}
                                >
                                    <Avatar src={conversation.avtUrl} name={conversation.fullName ?? conversation.username} />
                                </Conversation>
                            ))}
                        </ConversationList>
                    </Sidebar>

                    <ChatContainer>
                        {currentConver && (
                            <ConversationHeader>
                                <Avatar src={currentConver?.avtUrl} name={currentConver?.fullName ?? currentConver?.username} />
                                <ConversationHeader.Content userName={currentConver?.fullName ?? currentConver?.username} info={currentConver?.companyName ?? 'Người tìm việc'} />
                                <ConversationHeader.Actions>
                                    <VideoCallButton onClick={handleVideoCall} />
                                </ConversationHeader.Actions>
                            </ConversationHeader>
                        )}

                        <MessageList>
                            {currentConver?.last10Messages.filter(item => item != null).map((msg: ChatMessage, index) => {
                                return (msg.type == 'html' && !msg.message) ? null : (<Message
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
                                    {msg.type == 'html' && msg.message && <Message.CustomContent>
                                        <MessageJobCard
                                            jobId={Number(msg.message)}
                                        />
                                    </Message.CustomContent>}
                                </Message>);
                            })}

                            {/* <TypingIndicator content={`${currentConver?.name} is typing...`} /> */}
                        </MessageList>

                        {currentConver &&
                            <MessageInput
                                placeholder={`Type message to ${(currentConver?.fullName ?? currentConver?.username)}...`}
                                value={msgInput}
                                onChange={val => setMsgInput(val)}
                                onSend={() => { handleSendMessage('text') }}
                                onAttachClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.click();
                                    }
                                }}
                            />
                        }
                    </ChatContainer>
                </MainContainer>
            </> : <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                <div className="flex items-center mb-4">
                    <Inbox color="gray" className="mr-3" size={50} />
                </div>
                <p className="text-gray-400 text-lg font-medium">Hãy kết nối với người khác.</p>
            </div>
            }

            <input
                type="file"
                accept="image/*,application/pdf"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChosen}
            />
        </div >
    );
};

export default Messenger;
