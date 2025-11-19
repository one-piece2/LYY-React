import { useState, useRef, useEffect } from 'react';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { message } from 'antd';
import { ACTIONS } from '../Action';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';
const EditorPage = () => {
   const { roomId } = useParams();
   const [messageApi, contextHolder] = message.useMessage();
     const [clients, setClients] = useState([]);
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null);
  
  useEffect(() => {
    if (!location.state) return;
    const init = async () => {
      socketRef.current = await initSocket();
      //处理连接错误
      socketRef.current.on('connect_error', (err) => {
        handleErrors(err);
      });
      //处理连接失败
       socketRef.current.on('connect_failed', (err) => {
        handleErrors(err);
      });
       function handleErrors(e) {
                console.log('socket error', e);
              messageApi.open({
                type: 'error',
                content: 'Socket connection failed, try again later.',
            });
                reactNavigator('/');
            }
      // emit是发送事件:JOIN
      socketRef.current.emit(ACTIONS.JOIN, {
        username: location.state?.username,
        roomId,
      });

      // 监听JOINED事件
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state.username) {
           messageApi.open({
                type: 'success',
                content: `${username} joined the room`,
            });
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
                code:codeRef.current,
                //这个socketId是当前加入房间的用户的socketId
                socketId,
        })
      });
      // 监听DISCONNECTED事件
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
        messageApi.open({
          type: 'info',
          content: `${username} left the room`,
        });
      });
      
    }
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);

    }
  }, []);

//路由守卫 如果没有username 则跳转到首页
  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
        try {
          //浏览器
            await navigator.clipboard.writeText(roomId)
          messageApi.open({
                type: 'success',
                content: 'Room ID has been copied to your clipboard',
            });
        } catch (err) {
            messageApi.open({
                type: 'error',
                content: 'Could not copy the Room ID',
            });
            console.error(err);
        }
    }
    function leaveRoom() {
        reactNavigator('/');
    }
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/onepiece.png" alt="one-piece-logo" className="logoImage" width={100}></img>
          </div>
          <h3> Connected Users</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketid + client.username} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId} >
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn">
          Leave
        </button>
      </div>
      {contextHolder}



      <div className="editorWrap" style={{ backgroundColor: 'white' }}>
        <Editor socketRef={socketRef} roomId={roomId} leaveRoom={leaveRoom} onCodeChange={(code)=>codeRef.current=code} />
      </div>
    </div>
  );
};

export default EditorPage;