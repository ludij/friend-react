import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import HeaderLoggedOut from './header-logged-out';
import Register from './register';
import Login from './login';

export default function Welcome() {
    return (
        <React.Fragment>
            <HeaderLoggedOut />
            <HashRouter>
                <React.Fragment>
                    <Route
                        exact path="/"
                        component={Register}
                    />
                    <Route
                        path="/login"
                        component={Login}
                    />
                </React.Fragment>
            </HashRouter>
        </React.Fragment>
    );
}
