import { Client, Message as MessageStompjs, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';

class WebSocketService {
    private static instance: WebSocketService;
    private stompClient: Client | null = null;
    private isConnected: boolean = false;
    private subscriptions: { [key: string]: (message: any) => void } = {};

    private constructor() { }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect(userId: string, wsUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {

            if (!this.isConnected) {
                const sock = new SockJS(wsUrl + '/ws');
                this.stompClient = over(sock);
                this.isConnected = true;

                this.stompClient.connect(
                    {},
                    () => {
                        this.stompClient.subscribe('/user/' + userId + '/private', this.handleMessage.bind(this));

                        // const chatMessage: ChatMessage = {
                        //     sender: userId,
                        //     message: `${userId} connected to server.`,
                        //     sentTime: new Date().toISOString(),
                        //     receiver: '...',
                        //     status: Status.JOIN,
                        //     type: 'custom',
                        //     direction: 'outgoing',
                        //     position: 'normal',
                        //     id: uuidv4(),
                        // };
                        // this.stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                        resolve();
                    },
                    (error) => {
                        this.isConnected = false;
                        toast.error('Mất kết nối tới máy chủ, vui lòng thử lại.');
                        reject(error);
                    }
                );

                sock.onerror = () => {
                    this.isConnected = false;
                    toast.error('Có lỗi khi kết nối tới máy chủ, vui lòng thử lại.');
                    reject();
                };
            } else {
                resolve();
            }
        });
    }

    subscribe(key: string, callback: (message: any) => void) {
        this.subscriptions[key] = callback;
    }

    unsubscribe(key: string) {
        delete this.subscriptions[key];
    }

    private handleMessage(payload: MessageStompjs) {
        Object.values(this.subscriptions).forEach(callback => {
            callback(payload);
        });
    }

    sendMessage(message: any, url?: string) {
        if (this.stompClient && this.isConnected) {
            this.stompClient.send(url ?? "/app/private-message", {}, JSON.stringify(message));
        } else {
            toast.error("Mất kết nối tới máy chủ, vui lòng tải lại trang");
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient = null;
            this.isConnected = false;
        }
    }

    isConnectedToServer(): boolean {
        return this.isConnected;
    }
}

export default WebSocketService.getInstance();