import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome';
import App from './app';
import {initSocket} from './socket';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducer';
import {composeWithDevTools} from 'redux-devtools-extension';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let elem;
if (location.pathname == '/welcome') {
    elem = <Welcome />;
} else {
    initSocket(store);
    elem =
        (
            <Provider store={store}>
                <App />
            </Provider>
        );
}
ReactDOM.render(
    elem,
    document.querySelector('main')
);
