import { useState, useRef, useEffect } from 'react';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { ACTIONS } from '../Action';
import { useLocation } from 'react-router-dom';
const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      //emit是发送事件:JOIN
      // socketRef.current.emit(ACTIONS.JOIN, {
      //   username: location.state?.username,
      //   roomId,
      // });
    }
    init();
  }, []);
  const [clients, setClients] = useState([{
    socketid: 1,
    username: 'xxxx',
  },
  {
    socketid: 2,
    username: 'yyyy',
  },
  {
    socketid: 3,
    username: 'yyyy',
  },
  {
    socketid: 4,
    username: 'zzzz',
  },
  {
    socketid: 5,
    username: 'aaaa',
  },
  ]);
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
        <button className="btn copyBtn" >
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn">
          Leave
        </button>
      </div>


      <div className="editorWrap" style={{ backgroundColor: 'white' }}>
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;