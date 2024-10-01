import React, { useEffect, useState } from 'react';
import { Client, Message, over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient: Client = null;

enum Status {
    JOIN, LEAVE, MESSAGE
}

interface ChatMessage {
    sender: string;
    receiver: string;
    message: string;
    sentAt: number;
    status: Status;
}

const ChatRoom: React.FC = () => {
    const [listMessages, setListMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [receiver, setReceiver] = useState('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        console.log({ username, receiver, connected, message });
    }, [connected, message]);


    const connect = () => {
        const Sock = new SockJS('http://localhost:8888/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, (e) => console.log('Error:', e));
    };

    const onConnected = () => {
        setConnected(true);
        stompClient.subscribe('/user/' + username + '/private', onReceive);

        // connect thanh cong thi gui 1 tin nhan join ve
        const chatMessage: ChatMessage = {
            sender: username,
            message: `${username} connected to server.`,
            sentAt: Date.now(),
            receiver: '',
            status: Status.JOIN
        };
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
    };

    const onReceive = (payload: Message) => {
        const payloadData: ChatMessage = JSON.parse(payload.body);
        const chatMessage: ChatMessage = {
            sender: payloadData.sender,
            message: payloadData.message,
            sentAt: payloadData.sentAt,
            receiver: payloadData.receiver,
            status: Status.MESSAGE
        };
        setListMessages(prevChats => [...prevChats, chatMessage]);
    };


    const onSend = () => {
        if (stompClient) {
            const chatMessage: ChatMessage = {
                sender: username,
                message: message,
                sentAt: Date.now(),
                status: Status.MESSAGE,
                receiver: receiver
            };

            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));

            // Update the chat history with the new message
            // setListMessages(prevChats => [...prevChats, chatMessage]);
            setMessage('');
        }
    };

    useEffect(() => {
        listMessages.sort((a, b) => a.sentAt - b.sentAt);
    }, [listMessages]);

    return (
        <div className="container">
            {connected ? (
                <div className="chat-box">
                    <div className="chat-content">
                        <ul className="chat-messages">
                            {/* Render private messages with the receiver */}
                            {listMessages
                                .map((chat, index) => (
                                    <li className={`message ${chat.sender === username ? "self" : ""}`} key={index}>
                                        {chat.sender !== username && <div className="avatar">thang khac gui: {chat.message}</div>}
                                        {chat.sender === username && <div className="avatar self">Minh gui: {chat.message}</div>}
                                    </li>
                                ))}
                        </ul>

                        <div className="send-message">
                            <input
                                type="text"
                                className="input-message"
                                placeholder="Enter the message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="button" className="send-button" onClick={onSend}>Send</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="">
                    <h5>nguoi gui</h5>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} />
                    <h5>nguoi nhan</h5>
                    <input type="text" onChange={(e) => setReceiver(e.target.value)} />
                    <button type="button" onClick={connect}>
                        Connect
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
