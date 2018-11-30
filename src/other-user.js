import React from 'react';
import {connect} from 'react-redux';
import axios from './axios';
import {receiveFriends} from './actions';
import OtherUserProfile from './other-user-profile';
import PrivateChat from './private-chat';

class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.dispatch(receiveFriends());
        const otherUserUrl = '../profile/' + this.props.match.params.id;
        axios.get(otherUserUrl)
            .then(otherUserData => {
                if (otherUserData.data.id) {
                    this.setState(otherUserData.data);
                } else {
                    this.props.history.push('/');
                }
            })
            .catch(err => {
                console.log('error in get other user :id in componentDidMount: ', err);
            });
    }
    render() {
        const {friends, acceptedFriends} = this.props;
        if (!friends) {
            return null;
        }
        const isFriend = acceptedFriends.filter(
            friend =>
                friend.id == this.props.match.params.id
        );
        return (
            <React.Fragment>
                <h2>{this.state.firstname} {this.state.lastname}</h2>
                <br />

                {isFriend.length == 0 && (
                    <div>
                        <OtherUserProfile
                            firstname = {this.state.firstname}
                            lastname = {this.state.lastname}
                            avatar_url = {this.state.avatar_url}
                            bio = {this.state.bio}
                            otherUserId = {this.props.match.params.id}
                        />
                    </div>
                )}

                {isFriend.length > 0 && isFriend.map(
                    friend => (
                        <div className="flex" key={friend.id}>
                            <div className="flex-left">
                                <OtherUserProfile
                                    firstname = {this.state.firstname}
                                    lastname = {this.state.lastname}
                                    avatar_url = {this.state.avatar_url}
                                    bio = {this.state.bio}
                                    otherUserId = {this.props.match.params.id}
                                />
                            </div>
                            <div className="flex-right">
                                <PrivateChat
                                    otherUserId = {this.props.match.params.id}
                                />
                            </div>
                        </div>
                    )
                )}

            </React.Fragment>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        friends: state.friends,
        acceptedFriends: state.friends && state.friends.filter(friend => friend.accepted)
    };
};

export default connect(mapStateToProps)(OtherUser);
