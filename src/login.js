import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    handleInputChange(e) {
        this[e.target.name] = e.target.value;
        const inputs = document.getElementsByTagName('input');
        for (let val of inputs) {
            val.setCustomValidity("");
        }
    }
    handleButtonClick(e) {
        e.preventDefault();
        const inputs = document.getElementsByTagName('input');
        for (let val of inputs) {
            val.required = true;
        }
        for (let val of inputs) {
            if (!val.validity.valid) {
                return;
            }
        }
        axios.post('/login', {
            email: this.email,
            password: this.password
        })
            .then(function (res) {
                if (res.data.success) {
                    location.replace('/');
                    return;
                } else {
                    for (let val of inputs) {
                        val.setCustomValidity("invalid");
                    }
                    return;
                }
            })
            .catch(function (err) {
                console.log('error in class Login handleButtonClick: ', err);
                for (let val of inputs) {
                    val.setCustomValidity("invalid");
                }
                return;
            });
    }
    render() {
        return (
            <React.Fragment>
                <div className="wrapper">
                    <br />
                    <h2>Sign in here:</h2>
                    <br />
                    <form noValidate>
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
                            id="login"
                            name="login"
                            onClick={this.handleButtonClick}
                        >
                            Log in
                        </button>
                    </form>
                    <br />
                </div>
                <div className="wrapper">
                    <p>No account yet?</p>
                    <Link to="/">Register</Link>
                    <br />
                </div>
            </React.Fragment>
        );
    }
}
