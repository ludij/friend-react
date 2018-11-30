import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    handleInputChange(e) {
        this[e.target.name] = e.target.value;
    }
    handleButtonClick(e) {
        e.preventDefault();
        const input = document.getElementsByTagName('input');
        for (let val of input) {
            val.required = true;
        }
        for (let val of input) {
            if (!val.validity.valid) {
                return;
            }
        }
        axios.post('/welcome', {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        })
            .then(function (res) {
                if (res.data.success) {
                    location.replace('/');
                    return;
                } else {
                    console.log('error in axios.post /welcome');
                    return;
                }
            })
            .catch(function (err) {
                console.log('error in class Register handleButtonClick: ', err);
            });
    }
    render() {
        return (
            <React.Fragment>
                <div className="wrapper">
                    <br />
                    <h2>Sign up here:</h2>
                    <br />
                    <form noValidate>
                        <label htmlFor="firstName">Your First Name:</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="lastName">Your Last Name:</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="email">Your Email Address:</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={this.handleInputChange}
                        />
                        <label htmlFor="password">Your Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={this.handleInputChange}
                        />
                        <br />
                        <button
                            id="register"
                            name="register"
                            onClick={this.handleButtonClick}
                        >
                            Register
                        </button>
                    </form>
                    <br />
                </div>
                <div className="wrapper">
                    <p>Already have an account?</p>
                    <Link to="/login">Log in</Link>
                    <br />
                </div>
            </React.Fragment>
        );
    }
}
