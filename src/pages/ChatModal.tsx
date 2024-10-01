import React, { useState } from 'react';
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
    InfoButton,
    TypingIndicator,
    MessageProps,
    MessageModel,
} from "@chatscope/chat-ui-kit-react";

interface User {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
}

interface MessageData {
    id: string;
    content: string;
    sender: string;
    createdAt: Date;
    direction: 'incoming' | 'outgoing';
}

function ChatUI() {
    const users: User[] = [
        { id: '1', name: 'Joe', avatar: 'https://via.placeholder.com/40', lastMessage: 'Hello!' },
        { id: '2', name: 'Anna', avatar: 'https://via.placeholder.com/40', lastMessage: 'How are you?' },
        { id: '3', name: 'Sam', avatar: 'https://via.placeholder.com/40', lastMessage: 'Goodbye!' },
    ];

    const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messageInputValue, setMessageInputValue] = useState<string>("");

    const handleUserSelect = (user: User) => {
        setCurrentUser(user);
    };

    const handleSendMessage = () => {
        if (messageInputValue.trim() && currentUser) {
            const newMessage: MessageModel = {
                message: messageInputValue.trim(),
                sender: currentUser.name,
                sentTime: new Date().toDateString(),
                direction: 'outgoing',
                position: 'single'
            };

            setMessages(prevMessages => [...prevMessages, newMessage]);
            setMessageInputValue("");
        }
    };

    return (
        <div style={{ position: "relative", height: "100vh" }}>
            <MainContainer responsive>
                {/* Sidebar with users list */}
                <Sidebar position="left">
                    <ConversationList>
                        {users.map(user => (
                            <Conversation
                                key={user.id}
                                name={user.name}
                                lastSenderName={user.name}
                                info={user.lastMessage}
                                active={currentUser?.id === user.id}
                                onClick={() => handleUserSelect(user)}
                            >
                                <Avatar src={user.avatar} name={user.name} />
                            </Conversation>
                        ))}
                    </ConversationList>
                </Sidebar>

                {/* Chat container */}
                <ChatContainer>
                    {/* Display current user info */}
                    {currentUser && (
                        <ConversationHeader>
                            <Avatar src={currentUser.avatar} name={currentUser.name} />
                            <ConversationHeader.Content userName={currentUser.name} info="Online" />
                            <ConversationHeader.Actions>
                                <InfoButton />
                            </ConversationHeader.Actions>
                        </ConversationHeader>
                    )}

                    {/* Message list */}
                    <MessageList>
                        {messages.map((msg: MessageModel) => (
                            <Message
                                // key={msg.id}
                                model={{
                                    message: msg.message,
                                    sentTime: msg.sentTime,
                                    sender: msg.sender,
                                    direction: msg.direction,
                                    position: 'single',
                                    type: msg.type
                                }}
                            />
                        ))}
                        {/* Optional typing indicator */}
                        <TypingIndicator content={`${currentUser?.name} is typing...`} />
                    </MessageList>

                    {/* Message input */}
                    <MessageInput
                        placeholder={`Type message to ${currentUser?.name || "someone"}...`}
                        value={messageInputValue}
                        onChange={val => setMessageInputValue(val)}
                        onSend={handleSendMessage}  // Trigger handleSendMessage when the message is sent
                    />
                </ChatContainer>
            </MainContainer>
        </div>
    );
}

export default ChatUI;
