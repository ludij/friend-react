import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {initSocket} from './socket';

const moment = require('moment');

class PrivateChat extends React.Component {
    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.keyCheck = this.keyCheck.bind(this);
    }
    sendMessage() {
        let socket = initSocket();
        let value = document.getElementsByTagName('textarea')[0].value;
        if (value == "") {
            return;
        }
        let privateChatMessage = {
            value: value,
            otherUserId: this.props.otherUserId,
        };
        socket.emit('privateChatMessage', privateChatMessage);
        document.getElementsByTagName('textarea')[0].value = "";
    }
    keyCheck(e) {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }
    formatDate(date) {
        let now = moment(new Date());
        return now.to(date);
    }
    componentDidMount() {
        if (this.chatArea) {
            this.chatArea.scrollTop = this.chatArea.scrollHeight;
        }
    }
    componentDidUpdate() {
        if (this.chatArea) {
            this.chatArea.scrollTop = this.chatArea.scrollHeight;
        }
    }
    render() {
        const {privateChatMessages, otherUserId} = this.props;
        if (!privateChatMessages) {
            return null;
        }
        return (
            <React.Fragment>
                <h3>Private Chat</h3>
                <br />
                <div className="align-left">
                    <div className="chat-area" ref={elem => (this.chatArea = elem)}>
                        {privateChatMessages.map(
                            (message, index) =>
                                (message.receiver_id == otherUserId &&
                                (
                                    <React.Fragment key={index}>
                                        <p className="align-right float-right">
                                            <span className="small float-left date">
                                                {this.formatDate(message.created_at)}
                                            </span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <Link to={`/`}>
                                                You:
                                            </Link>
                                            <br />
                                            {message.message}
                                        </p>
                                        <br />
                                        <br />
                                        <br />
                                    </React.Fragment>
                                ))
                                ||
                                (message.id == otherUserId &&
                                (
                                    <React.Fragment key={index}>
                                        <p className="float-left">
                                            <Link to={`/user/${message.id}`}>
                                                <img
                                                    className="avatar"
                                                    src={message.avatar_url || "/avatar.png"}
                                                    alt={`${message.firstname} ${message.lastname}`}
                                                    title={`${message.firstname} ${message.lastname}`}
                                                />
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                {message.firstname} {message.lastname}:
                                            </Link>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="small float-right date">
                                                {this.formatDate(message.created_at)}
                                            </span>
                                            <br />
                                            {message.message}
                                        </p>
                                        <br />
                                        <br />
                                        <br />
                                    </React.Fragment>
                                ))
                        )}
                    </div>
                    <br />
                    <textarea onKeyDown = {this.keyCheck}></textarea>
                    <br />
                    <br />
                    <button
                        id="sendMessage"
                        name="sendMessage"
                        className="align-center"
                        onClick={this.sendMessage}
                    >
                        Send
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        privateChatMessages: state.privateChatMessages
    };
};

export default connect(mapStateToProps)(PrivateChat);
