import React from 'react';
import axios from './axios';
import Bio from './bio';

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    handleButtonClick(e) {
        e.preventDefault();
        axios.post('/profile/delete')
            .then(response => {
                if (response.data[0].success) {
                    location.replace('/');
                }
            });
    }
    render() {
        return (
            <React.Fragment>
                <h2>My Profile</h2>
                <br />
                <div className="flex">
                    <div className="flex-left">
                        <img
                            className="big-avatar"
                            src={this.props.avatar_url || "avatar.png"}
                            alt={`${this.props.firstname} ${this.props.lastname}`}
                            title="Click to change your profile picture"
                            onClick={this.props.avatarModalVisibility}
                        />
                        <br />
                        <br />
                        <form noValidate>
                            <a
                                className="small"
                                href="#"
                                onClick={this.handleButtonClick}
                            >
                                Delete Profile
                            </a>
                        </form>
                    </div>
                    <div className="align-left flex-right">
                        <p>
                            First Name:
                            <br />
                            {this.props.firstname}
                            <br />
                            <br />
                            Last Name:
                            <br />
                            {this.props.lastname}
                            <br />
                            <br />
                            Email Address:
                            <br />
                            {this.props.email}
                        </p>
                        <br />

                        <Bio
                            bio={this.props.bio}
                            loadBio = {this.props.loadBio}
                        />
                    </div>
                </div>
                <br />
            </React.Fragment>
        );
    }
}
