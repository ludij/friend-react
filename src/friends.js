import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {receiveFriends, acceptFriend, deleteFriend} from './actions';

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriends());
    }
    render() {
        const {friends, acceptedFriends, unacceptedFriends, dispatch} = this.props;
        if (!friends) {
            return null;
        }
        return (
            <React.Fragment>
                <h2>My Friends</h2>
                <br />

                {friends.length == 0 && <p>No friends yet</p>}

                {friends.length > 0 &&
                    (
                        <div className="flex">
                            <div>
                                <h3>Friends:</h3>
                                <br />
                                {acceptedFriends.length == 0 && (
                                    <p>No friends yet</p>
                                )}
                                {acceptedFriends.map(
                                    friend => (
                                        <React.Fragment key={friend.id}>
                                            <p>
                                                <Link to={`/user/${friend.id}`}>
                                                    <img
                                                        className="avatar"
                                                        src={friend.avatar_url || "/avatar.png"}
                                                        alt={`${friend.firstname} ${friend.lastname}`}
                                                        title="Profile picture"
                                                    />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    {friend.firstname} {friend.lastname}
                                                </Link>
                                                <br />
                                                <a
                                                    className="small"
                                                    href="#"
                                                    onClick={() => dispatch(deleteFriend(friend.id))}
                                                >
                                                    End friendship
                                                </a>
                                            </p>
                                            <br />
                                        </React.Fragment>
                                    )
                                )}
                            </div>
                            <div>
                                <h3>Friend requests:</h3>
                                <br />
                                {unacceptedFriends.length == 0 && (
                                    <p>No friend requests</p>
                                )}
                                {unacceptedFriends.map(
                                    friend => (
                                        <React.Fragment key={friend.id}>
                                            <p>
                                                <Link to={`/user/${friend.id}`}>
                                                    <img
                                                        className="avatar"
                                                        src={friend.avatar_url || "/avatar.png"}
                                                        alt={`${friend.firstname} ${friend.lastname}`}
                                                        title="Profile picture"
                                                    />
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    {friend.firstname} {friend.lastname}
                                                </Link>
                                                <br />
                                                <a
                                                    className="small"
                                                    href="#"
                                                    onClick={() => dispatch(acceptFriend(friend.id))}
                                                >
                                                    Accept friend request
                                                </a>
                                            </p>
                                            <br />
                                        </React.Fragment>
                                    )
                                )}
                            </div>
                        </div>
                    )
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        friends: state.friends,
        acceptedFriends: state.friends && state.friends.filter(friend => friend.accepted),
        unacceptedFriends: state.friends && state.friends.filter(friend => !friend.accepted)
    };
};

export default connect(mapStateToProps)(Friends);
