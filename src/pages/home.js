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
                    <a href="https://www.google.com/search?sca_esv=8994b4a378b58ce1&sxsrf=AE3TifOpUrVKyyzfATXIWXA-Pg69gXdp2g:1763540161843&udm=2&fbs=AIIjpHybaGNnaZw_4TckIDK59RtxzhN-zPLOQlOthwdFc1z8xdIAyg6_Ea865cNowKrZE6NSTLBfFrq-gxzZeTs5ToMTBmV283UPaENpTjrvARNPv_qIFy_HKftDQO2-rnZIb1uvjz_Z9RIhaM27HZ1aJ5uP1PPpyBDXTwbzjA7cqwe9SdD9AfKnweFdvW7s0EY4wdiSDRZSRUNgnXr3tAIcpgBJmbExeA&q=%E6%B5%B7%E8%B4%BC%E7%8E%8B%E5%90%A7&sa=X&ved=2ahUKEwj1_JKH4_2QAxWLs1YBHer2HYoQtKgLegQIFRAB&biw=1707&bih=825&dpr=2.25#vhid=8G4C5ZT15-KAnM&vssid=mosaic">lyy</a>
                </h4>
            </footer>
        </div>

    );
};

export default Home;