export default function reducer(state = {}, action) {

    if (action.type == 'RECEIVE_FRIENDS') {
        state = {
            ...state,
            friends: action.friends
        };
    }

    if (action.type == 'ACCEPT_FRIEND') {
        state = {
            ...state,
            friends: state.friends.map(
                friend =>
                    friend.id == action.otherUserId ? {
                        ...friend,
                        accepted: true
                    } : friend
            )
        };
    }

    if (action.type == 'DELETE_FRIEND') {
        state = {
            ...state,
            friends: state.friends.filter(
                friend => friend.id != action.otherUserId
            )
        };
    }

    if (action.type == 'USER_ID') {
        state = {
            ...state,
            userId: action.userId
        };
    }

    if (action.type == 'ONLINE_USERS') {
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == 'USER_JOINED') {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(action.userJoined)
        };
    }

    if (action.type == 'USER_LEFT') {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user =>
                    user.id != action.userLeft
            )
        };
    }

    if (action.type == 'CHAT_MESSAGES') {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    if (action.type == 'CHAT_MESSAGE') {
        let limitedChatMessages;
        if (state.chatMessages.length > 9) {
            limitedChatMessages = state.chatMessages.slice(1);
        } else {
            limitedChatMessages = state.chatMessages;
        }
        state = {
            ...state,
            chatMessages: [...limitedChatMessages, action.chatMessage]
        };
    }

    if (action.type == 'PRIVATE_CHAT_MESSAGES') {
        state = {
            ...state,
            privateChatMessages: action.privateChatMessages
        };
    }

    if (action.type == 'PRIVATE_CHAT_MESSAGE') {
        let limitedPrivateChatMessages;
        if (state.privateChatMessages.length > 9) {
            limitedPrivateChatMessages = state.privateChatMessages.slice(1);
        } else {
            limitedPrivateChatMessages = state.privateChatMessages;
        }
        state = {
            ...state,
            privateChatMessages: [...limitedPrivateChatMessages, action.privateChatMessage]
        };
    }

    return state;
}
