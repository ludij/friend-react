import React from 'react';
import OnlineUsers from './online-users';
import Chat from './chat';

export default function Online(){
    return (
        <React.Fragment>
            <h2>Online Now</h2>
            <br />
            <div className="flex">
                <div className="flex-left">
                    <Chat />
                </div>
                <div className="flex-right">
                    <OnlineUsers />
                </div>
            </div>
        </React.Fragment>

    );
}
