import React from 'react';
import axios from './axios';

export default class AvatarModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleAvatarChange = this.handleAvatarChange.bind(this);
        this.modalClose = this.modalClose.bind(this);
    }
    handleAvatarChange(e) {
        let newAvatar = e.target.files[0];
        let formData = new FormData();
        formData.append('file', newAvatar);
        axios.post('/upload-avatar', formData)
            .then(res => {
                this.props.loadAvatar(res);
                this.props.avatarModalVisibility();
            })
            .catch(err => {
                console.log("error in post upload-avatar in handleAvatarChange: ", err);
            });
    }
    modalClose() {
        this.props.avatarModalVisibility();
    }
    stopPropagation(e) {
        e.stopPropagation();
    }
    render() {
        return (
            <React.Fragment>
                <div
                    className="avatar-modal"
                    onClick={this.modalClose}
                >
                    <form noValidate>
                        <label
                            htmlFor="file-upload"
                            tabIndex="0"
                            onClick={this.stopPropagation}
                        >
                            Browse files
                            <input
                                id="file-upload"
                                name="file"
                                type="file"
                                accept="image/*"
                                onChange={this.handleAvatarChange}
                            >
                            </input>
                        </label>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}
