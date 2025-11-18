const express = require('express');
//创建 Express 应用实例 app
const app = express();
const http = require('http');
//从 socket.io 库中解构出 Server 类，这是 Socket.IO 的核心类，用于创建 WebSocket 服务。
const { Server } = require('socket.io');
//作用：创建一个 HTTP 服务器实例，将 Express 应用实例 app 作为参数传递。
const server = http.createServer(app);
//创建 Socket.IO 服务器实例 io，将 HTTP 服务器实例 server 作为参数传递。
const io = new Server(server); 

//作用：监听客户端'connection' 事件，当有新的 WebSocket 连接时触发。
//参数socket - 新连接的 WebSocket 实例，通过它可以与该客户端进行单独通信（发送 / 接收消息）。
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
});
const PORT=process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});



 