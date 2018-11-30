import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {receiveFriends} from './actions';

class Online extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriends());
    }
    render() {
        const {onlineUsers, friends, onlineFriends, onlineStrangers} = this.props;
        if (!onlineUsers || !friends) {
            return null;
        }
        return (
            <React.Fragment>
                <h3>My Friends:</h3>
                <br />
                {onlineFriends.length == 0 && <p>None of your friends are online at this moment.</p>}

                {onlineFriends.length > 0 &&
                    (
                        <div>
                            {onlineFriends.map(
                                user => (
                                    <React.Fragment key={user.id}>
                                        <p>
                                            <Link to={`/user/${user.id}`}>
                                                <img
                                                    className="avatar"
                                                    src={user.avatar_url || "/avatar.png"}
                                                    alt={`${user.firstname} ${user.lastname}`}
                                                    title="Profile picture"
                                                />
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                {user.firstname} {user.lastname}
                                            </Link>
                                        </p>
                                        <br />
                                    </React.Fragment>
                                )
                            )}
                        </div>
                    )
                }

                <br />

                <h3>Other People:</h3>
                <br />
                {onlineStrangers.length == 0 && <p>No-one else is online at this moment.</p>}

                {onlineStrangers.length > 0 &&
                    (
                        <div>
                            {onlineStrangers.map(
                                user => (
                                    <React.Fragment key={user.id}>
                                        <p>
                                            <Link to={`/user/${user.id}`}>
                                                <img
                                                    className="avatar"
                                                    src={user.avatar_url || "/avatar.png"}
                                                    alt={`${user.firstname} ${user.lastname}`}
                                                    title="Profile picture"
                                                />
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                {user.firstname} {user.lastname}
                                            </Link>
                                        </p>
                                        <br />
                                    </React.Fragment>
                                )
                            )}
                        </div>
                    )
                }
            </React.Fragment>

        );
    }
}

const mapStateToProps = function(state) {
    return {
        onlineUsers: state.onlineUsers,
        friends: state.friends,
        onlineFriends: state.friends && state.onlineUsers.filter(
            user => state.friends.some(
                friend => friend.accepted && friend.id == user.id
            )
        ),
        onlineStrangers: state.friends && state.onlineUsers.filter(
            user => !state.friends.some(
                friend => friend.accepted && friend.id == user.id
            )
        )
    };
};

export default connect(mapStateToProps)(Online);
