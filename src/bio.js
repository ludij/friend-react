import React from 'react';
import axios from './axios';

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bio: props.bio};
        this.bioTextareaVisibility = this.bioTextareaVisibility.bind(this);
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
        this.submitBioChange = this.submitBioChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    bioTextareaVisibility() {
        this.state.bio ?
            this.setState({bio: false}) : this.setState({bio: true});
    }
    handleTextareaChange(e) {
        this.bio = document.getElementsByTagName('textarea')[0].value;
        if (e && e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            this.submitBioChange();
        }
    }
    handleButtonClick(e) {
        e.preventDefault();
        this.handleTextareaChange();
        this.submitBioChange();
    }
    submitBioChange() {
        if (!this.bio) {
            this.bio = this.props.bio;
        }
        const textarea = document.getElementsByTagName('textarea');
        textarea[0].required = true;
        if (!textarea[0].validity.valid) {
            return;
        }
        axios.post('/bio', {
            bio: this.bio
        })
            .then(res => {
                this.props.loadBio(res);
                this.bioTextareaVisibility();
            })
            .catch(err => {
                console.log("error in post bio in handleButtonClick: ", err);
            });
    }
    render() {
        return (
            <React.Fragment>
                <p>
                    About Me:
                    {this.state.bio && (
                        <React.Fragment>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a className="small" href="#" onClick={this.bioTextareaVisibility}>
                                Edit
                            </a>
                        </React.Fragment>
                    )}
                </p>
                {this.state.bio ? (
                    <React.Fragment>
                        <p>
                            {this.props.bio}
                        </p>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <form noValidate>
                            <textarea
                                id="bio"
                                name="bio"
                                type="text"
                                defaultValue={this.props.bio}
                                onKeyDown={this.handleTextareaChange}
                            />
                            <br />
                            <br />
                            <button
                                id="update"
                                name="update"
                                onClick={this.handleButtonClick}
                            >
                                Update
                            </button>
                        </form>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}
