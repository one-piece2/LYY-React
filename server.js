const express = require('express');
//创建 Express 应用实例 app
const app = express();
const http = require('http');
const path = require('path');
//从 socket.io 库中解构出 Server 类，这是 Socket.IO 的核心类，用于创建 WebSocket 服务。
const { Server } = require('socket.io');
const { ACTIONS } = require('./src/Action');
//作用：创建一个 HTTP 服务器实例，将 Express 应用实例 app 作为参数传递。
const server = http.createServer(app);
//创建 Socket.IO 服务器实例 io，将 HTTP 服务器实例 server 作为参数传递。
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000, // 可选，让socket延迟更容忍
});
//作用：将 React 应用的静态文件（如 CSS、JavaScript、图片等）从 build 目录提供给客户端。
//这允许客户端直接访问这些文件，而不需要服务器端的额外处理。
app.use(express.static('build'));
//作用：当客户端请求任何路由时，都返回 React 应用的 index.html 文件。
//这是 React 单页应用的关键，确保所有路由都由 React 处理，而不是由服务器处理。
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
const userSocketMap = {};
function getAllConnectedClients(roomId) {
//io.sockets.adapter.rooms.get(roomId) - 获取指定房间 roomId 中的所有连接的 WebSocket 实例的集合（Set）。
//Array.from(io.sockets.adapter.rooms.get(roomId) || []) - 将集合转换为数组，确保即使房间为空也不会出错。
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
              socketId,
            username: userSocketMap[socketId],
        }
    })
}
//作用：监听客户端'connection' 事件，当有新的 WebSocket 连接时触发。
//参数socket - 新连接的 WebSocket 实例，通过它可以与该客户端进行单独通信（发送 / 接收消息）。
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
       userSocketMap[socket.id] = username;
       socket.join(roomId);
       const clients=getAllConnectedClients(roomId);
       // 通知所有已连接客户端当前加入的用户 一个个通知
       clients.forEach(({socketId})=>{
        io.to(socketId).emit(ACTIONS.JOINED,{
            clients,
            username,
            socketId: socket.id,
        })
       })
        
      
    })
 //客户端正在断开连接
    socket.on('disconnecting', () => {
        const rooms=[...socket.rooms];
        rooms.forEach((roomId)=>{
            // 给房间中的所有客户端发送消息（不包括当前断开的客户端）
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })

        delete userSocketMap[socket.id];
        socket.leave();
    })

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        //socket.in自己不会收到广播   io.in自己也会收到广播
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    })
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    })
    
});
const PORT=process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});



 
