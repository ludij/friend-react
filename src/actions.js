import axios from './axios';

export async function receiveFriends() {
    const {data} = await axios.get('/friends/all');
    return {
        type: 'RECEIVE_FRIENDS',
        friends: data
    };
}

export async function acceptFriend(otherUserId) {
    await axios.post('/friends-accept/' + otherUserId);
    return {
        type: 'ACCEPT_FRIEND',
        otherUserId
    };
}

export async function deleteFriend(otherUserId) {
    await axios.post('/friends-end/' + otherUserId);
    return {
        type: 'DELETE_FRIEND',
        otherUserId
    };
}

export async function userId(user) {
    return {
        type: 'USER_ID',
        userId: user
    };
}

export async function onlineUsers(onlineUsers) {
    return {
        type: 'ONLINE_USERS',
        onlineUsers: onlineUsers
    };
}

export async function userJoined(user) {
    return {
        type: 'USER_JOINED',
        userJoined: user
    };
}

export async function userLeft(user) {
    return {
        type: 'USER_LEFT',
        userLeft: user
    };
}

export async function chatMessages(messages) {
    return {
        type: 'CHAT_MESSAGES',
        chatMessages: messages
    };
}

export async function chatMessage(message) {
    return {
        type: 'CHAT_MESSAGE',
        chatMessage: message
    };
}

export async function privateChatMessages(messages) {
    return {
        type: 'PRIVATE_CHAT_MESSAGES',
        privateChatMessages: messages
    };
}

export async function privateChatMessage(message) {
    return {
        type: 'PRIVATE_CHAT_MESSAGE',
        privateChatMessage: message
    };
}
