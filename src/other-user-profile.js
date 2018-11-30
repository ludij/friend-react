import React from 'react';
import FriendButton from './friend-button';

export default function OtherUserProfile(props) {
    return (
        <React.Fragment>
            <img
                className="big-avatar"
                src={props.avatar_url || "/avatar.png"}
                alt={`${props.firstname} ${props.lastname}`}
                title="Click to change your profile picture"
            />
            <br />
            <br />
            <FriendButton otherUserId = {props.otherUserId}/>
            <br />
            <p>
                About {props.firstname}:
                <br />
                {props.bio || "No description yet..."}
            </p>
            <br />
        </React.Fragment>
    );
}
