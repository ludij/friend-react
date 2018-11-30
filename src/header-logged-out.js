import React from 'react';

export default function Header() {
    return (
        <React.Fragment>
            <div className="wrapper">
                <a href="/">
                    <h1>Friend React</h1>
                </a>
                <p>A Social Network built with <a href="https://reactjs.org/">React</a></p>
            </div>
        </React.Fragment>
    );
}
