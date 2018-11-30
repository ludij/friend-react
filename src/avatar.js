import React from 'react';

export default function Avatar(props){ // leave out the name of the function?
    if (!props.id) {
        return null;
    }
    return (
        <React.Fragment>
            <img
                className="avatar"
                src={props.avatar_url || "/avatar.png"}
                alt={`${props.firstname} ${props.lastname}`}
                title="Click to change your profile picture"
                onClick={props.avatarModalVisibility}
            />
        </React.Fragment>
    );
}
