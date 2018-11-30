import React from 'react';
import {Link} from 'react-router-dom';
import Avatar from './avatar';

export default function Header(props) {
    return (
        <React.Fragment>
            <div className="wrapper">
                <Link to="/">
                    <h1>Friend React</h1>
                </Link>
                <p>
                    <Avatar
                        id = {props.id}
                        firstname = {props.firstname}
                        lastname = {props.lastname}
                        email = {props.email}
                        avatar_url = {props.avatar_url}
                        avatarModalVisibility = {props.avatarModalVisibility}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/">{props.firstname} {props.lastname}</Link>
                    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/friends">My Friends</Link>
                    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/online">Online now</Link>
                </p>
            </div>
        </React.Fragment>
    );
}
