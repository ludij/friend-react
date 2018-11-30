import React from 'react';
import axios from './axios';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    componentDidMount() {
        const url = '../friends/' + this.props.otherUserId;
        axios.get(url)
            .then(result => {
                this.setState(result.data.rows[0]);
            });
    }
    handleButtonClick(e) {
        e.preventDefault();
        const otherUserId = this.props.otherUserId;
        const receiverId = this.state.receiver_id;
        const accepted = this.state.accepted;

        if (!receiverId) {
            const url = '../friends-request/' + otherUserId;
            axios.post(url)
                .then(result => {
                    this.setState(result.data[0]);
                })
                .catch(err => console.log("error in post friends-request/otherUserId: ", err));
            return;
        }

        if (!accepted && receiverId != otherUserId) {
            const url = '../friends-accept/' + otherUserId;
            axios.post(url)
                .then(result => {
                    this.setState({accepted: result.data[0].accepted});
                })
                .catch(err => console.log("error in post friends-accept/otherUserId: ", err));
            return;
        }

        if ((!accepted && receiverId == otherUserId) || (receiverId && accepted)) {
            const url = '../friends-end/' + otherUserId;
            axios.post(url)
                .then(() => {
                    this.setState({receiver_id: null});
                })
                .catch(err => console.log("error in post friends-end/otherUserId: ", err));
            return;
        }

    }
    render() {
        const otherUserId = this.props.otherUserId;
        const receiverId = this.state.receiver_id;
        const accepted = this.state.accepted;
        return (
            <React.Fragment>
                <form noValidate>
                    <button
                        id="friends"
                        name="friends"
                        onClick={this.handleButtonClick}
                    >
                        {
                            (!receiverId && "Send friend request")
                            ||
                            (accepted && "End friendship")
                            ||
                            (!accepted &&
                                (receiverId == otherUserId && "Withdraw friend request")
                                ||
                                (receiverId != otherUserId && "Accept friend request")
                            )
                        }
                    </button>
                </form>
            </React.Fragment>
        );
    }
}
