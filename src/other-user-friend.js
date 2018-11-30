import React from 'react';
import axios from './axios';
import FriendButton from './friend-button';
import PrivateChat from './private-chat';

export default class OtherUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const otherUserUrl = '../profile/' + this.props.match.params.id;
        axios.get(otherUserUrl)
            .then(otherUserData => {
                if (otherUserData.data.id) {
                    this.setState(otherUserData.data);
                } else {
                    this.props.history.push('/');
                }
            })
            .catch(function (err) {
                console.log('error in get other user :id in componentDidMount: ', err);
            });
    }
    render() {
        return (
            <React.Fragment>
                <h2>{this.state.firstname} {this.state.lastname}</h2>
                <br />
                <div className="flex">
                    <div className="flex-left">
                        <OtherUser />
                    </div>
                    <div className="flex-right">
                        <PrivateChat />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
