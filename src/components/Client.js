import React from 'react';

import { Avatar } from 'antd';
const Client = ({ username }) => {
    return (
        <div className="client">
            <Avatar style={{ backgroundColor: '#00a2ae', verticalAlign: 'middle' }} size="large">
                {username.slice(0, 2)}
            </Avatar>
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;