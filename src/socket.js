import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        
       
        // 最大重连次数
        reconnectionAttempt: Infinity,
        // 重新连接延迟
        reconnectionDelay: 1000,
        timeout: 10000,
        // 强制使用 WebSocket 传输
        transports: ['websocket'],
    };
    return io("https://lyyyyds.zeabur.app",options);
};
