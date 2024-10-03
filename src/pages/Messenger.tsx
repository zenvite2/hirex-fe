import React, { useCallback, useEffect, useState } from 'react';
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
import { startLoading, stopLoading } from '../redux/slice/loadingSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

enum Status {
    JOIN = 'JOIN',
    LEAVE = 'LEAVE',
    MESSAGE = 'MESSAGE',
}

interface User {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
}

interface ChatMessage extends MessageModel {
    receiver: string;
    status: Status;
}

let stompClient: Client | null = null;
let isConnected = false;

const Messenger: React.FC = () => {
    const currentUser = 'viet';
    const users: User[] = [
        { id: '1', name: 'viet', avatar: 'https://via.placeholder.com/40', lastMessage: 'Hello!' },
        { id: '2', name: 'Anna', avatar: 'https://via.placeholder.com/40', lastMessage: 'How are you?' },
        { id: '3', name: 'Sam', avatar: 'https://via.placeholder.com/40', lastMessage: 'Goodbye!' },
    ];
    const dispatch = useDispatch();
    const [currentChatFriend, setCurrentChatFriend] = useState<User | null>(users[0]);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messageInputValue, setMessageInputValue] = useState<string>("");

    useEffect(() => {
        dispatch(startLoading());
        connect();
    }, []);

    const connect = () => {
        if (isConnected) {
            stompClient.connect({}, onConnected, (e) => { dispatch(stopLoading()); console.log('Error:', e) });
        } else {
            const Sock = new SockJS('http://localhost:8888/ws');
            stompClient = over(Sock);
            isConnected = true;
            stompClient.connect({}, onConnected, (e) => { dispatch(stopLoading()); console.log('Error:', e) });
        }
    };

    const onConnected = () => {
        dispatch(stopLoading());
        stompClient.subscribe('/user/' + currentUser + '/private', onReceive);
        const chatMessage: ChatMessage = {
            sender: currentUser,
            message: `${currentUser} connected to server.`,
            sentTime: Date.now().toLocaleString(),
            receiver: '...',
            status: Status.JOIN,
            type: 'text',
            direction: 'outgoing',
            position: 'normal'
        };
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
    };

    const onReceive = (payload: MessageStompjs) => {
        const payloadData: ChatMessage = { ...JSON.parse(payload.body), position: 'normal', direction: 'incoming' };
        setMessages(prevMessages => [...prevMessages, payloadData]);
    };

    const handleSendMessage = () => {
        if (stompClient) {
            if (messageInputValue.trim() && currentChatFriend) {
                const chatMessage: ChatMessage = {
                    sender: currentUser,
                    receiver: currentChatFriend.name,
                    message: messageInputValue.trim(),
                    sentTime: Date.now().toLocaleString(),
                    status: Status.MESSAGE,
                    direction: 'outgoing',
                    position: 'normal'
                };
                stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                setMessageInputValue("");
            }
        }
        else {
            toast.error("You are disconnected from server. Please reload the page and try again.");
        }
    };

    return (
        <div style={{ position: "relative", height: "100%", width: "100%", flex: 1 }}>
            <MainContainer responsive>
                <Sidebar position="left">
                    <ConversationList>
                        {users.map(user => (
                            <Conversation
                                key={user.id}
                                name={user.name}
                                lastSenderName={user.name}
                                info={user.lastMessage}
                                active={currentChatFriend?.id === user.id}
                                onClick={() => setCurrentChatFriend(user)}
                            >
                                <Avatar src={user.avatar} name={user.name} />
                            </Conversation>
                        ))}
                    </ConversationList>
                </Sidebar>

                <ChatContainer>
                    {currentChatFriend && (
                        <ConversationHeader>
                            <Avatar src={currentChatFriend.avatar} name={currentChatFriend.name} />
                            <ConversationHeader.Content userName={currentChatFriend.name} info="Online" />
                            <ConversationHeader.Actions>
                                <VideoCallButton />
                            </ConversationHeader.Actions>
                        </ConversationHeader>
                    )}

                    <MessageList>
                        {messages.map((msg: MessageModel, index) => (
                            <Message
                                key={index}
                                model={{
                                    message: msg.message,
                                    sentTime: new Date(msg.sentTime).toLocaleTimeString(),
                                    sender: msg.sender,
                                    direction: msg.sender === currentUser ? 'outgoing' : 'incoming',
                                    position: 'single',
                                }}
                            />
                        ))}
                        {/* <TypingIndicator content={`${currentChatFriend?.name} is typing...`} /> */}
                    </MessageList>

                    <MessageInput
                        placeholder={`Type message to ${currentChatFriend?.name || "anonymous"}...`}
                        value={messageInputValue}
                        onChange={val => setMessageInputValue(val)}
                        onSend={handleSendMessage}
                    />
                </ChatContainer>
            </MainContainer>
        </div>
    );
};

export default Messenger;
