import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        // console.log(id);
        setRoomId(id);
        messageApi.open({
            type: 'success',
            content: 'Created a new room',
        });
    }
    const joinRoom = () => {
        
        if (!roomId || !username) {
            messageApi.open({
                type: 'error',
                content: 'ROOM ID & uesrname is Required',
            });
            return;
        }
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    }
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (
        <div className="homePageWrapper">
            {contextHolder}
            <div className="formWrapper">
                <img src="./onepiece.png" alt="one-piece-logo" className="homePageLogo"></img>
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                    />
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>

            <footer>
                <h4 >
                    Built with 💛 &nbsp; by &nbsp;
                    <a href="https://github.com/codersgyan">xxxx</a>
                </h4>
            </footer>
        </div>

    );
};

export default Home;