import * as io from 'socket.io-client';
import {userId, onlineUsers, userJoined, userLeft, chatMessages, chatMessage, privateChatMessages, privateChatMessage} from './actions';

let socket;
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on('userId', user =>
            store.dispatch(userId(user)));

        socket.on('onlineUsers', users =>
            store.dispatch(onlineUsers(users)));

        socket.on('userJoined', user =>
            store.dispatch(userJoined(user)));

        socket.on('userLeft', user =>
            store.dispatch(userLeft(user)));

        socket.on('chatMessages', messages =>
            store.dispatch(chatMessages(messages)));

        socket.on('chatMessage', message =>
            store.dispatch(chatMessage(message)));

        socket.on('privateChatMessages', messages =>
            store.dispatch(privateChatMessages(messages)));

        socket.on('privateChatMessage', message =>
            store.dispatch(privateChatMessage(message)));
    }
    return socket;
}
