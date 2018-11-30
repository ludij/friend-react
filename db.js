const spicedPg = require('spiced-pg');
let secrets;
let db;
if (process.env.NODE_ENV == 'production') {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    secrets = require('./secrets');
    db = spicedPg(`postgres:${secrets.serverUsername}:${secrets.serverPassword}@localhost:5432/socialnetwork`);
}
const amazonUrl = 'https://s3.amazonaws.com/spiced-socialnetwork/';

exports.insertUser = function(userInput, hash) {
    return db.query(
        `INSERT INTO users
        (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
            userInput.firstName || null,
            userInput.lastName || null,
            userInput.email || null,
            hash || null
        ]
    );
};

exports.selectUser = function(email) {
    return db.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.selectUserById = function(id) {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.updateAvatar = req => {
    return db.query(
        `UPDATE users
        SET avatar_url = $1
        WHERE id = $2
        RETURNING *`,
        [
            amazonUrl + req.file.filename,
            req.session.user.id
        ]
    );
};

exports.updateBio = req => {
    return db.query(
        `UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING *`,
        [
            req.body.bio,
            req.session.user.id
        ]
    );
};

exports.getFriendship = (otherUserId, currentUserId) => {
    return db.query(
        `SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [
            otherUserId,
            currentUserId
        ]
    );
};

exports.insertFriendsRequest = (currentUserId, otherUserId) => {
    return db.query(
        `INSERT INTO friendships
        (sender_id, receiver_id)
        VALUES ($1, $2)
        RETURNING *`,
        [
            currentUserId,
            otherUserId
        ]
    );
};

exports.updateFriendsAccept = (currentUserId, otherUserId) => {
    return db.query(
        `UPDATE friendships
        SET accepted = $1
        WHERE (receiver_id = $2 AND sender_id = $3)
        RETURNING *`,
        [
            true,
            currentUserId,
            otherUserId
        ]
    );
};

exports.deleteFriends = (currentUserId, otherUserId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [
            currentUserId,
            otherUserId
        ]
    );
};

exports.getFriends = (currentUserId) => {
    return db.query(
        `SELECT users.id, users.firstname, users.lastname, users.avatar_url, friendships.accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [currentUserId]
    );
};

exports.getChatMessages = () => {
    return db.query(
        `SELECT users.id, users.firstname, users.lastname, users.avatar_url, chat.message, chat.created_at
        FROM chat
        LEFT JOIN users
        ON (user_id = users.id)
        ORDER BY chat.id DESC
        LIMIT 10`
    );
};

exports.insertChatMessage = (userId, message) => {
    return db.query(
        `INSERT INTO chat
        (user_id, message)
        VALUES ($1, $2)`,
        [
            userId,
            message
        ]
    );
};

exports.getPrivateChatMessages = (userId) => {
    return db.query(
        `SELECT users.id, users.firstname, users.lastname, users.avatar_url, privatechat.receiver_id, privatechat.message, privatechat.created_at
        FROM privatechat
        JOIN users
        ON (sender_id = users.id AND sender_id = $1)
        OR (sender_id = users.id AND receiver_id = $1)
        ORDER BY privatechat.id DESC`,
        [userId]
    );
};

exports.insertPrivateChatMessage = (userId, otherUserId, message) => {
    return db.query(
        `INSERT INTO privatechat
        (sender_id, receiver_id, message)
        VALUES ($1, $2, $3)`,
        [
            userId,
            otherUserId,
            message
        ]
    );
};

exports.deleteAllFriends = (currentUserId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE (receiver_id = $1)
        OR (sender_id = $1)`,
        [currentUserId]
    );
};

exports.deleteAllChats = (currentUserId) => {
    return db.query(
        `DELETE FROM chat
        WHERE (user_id = $1)`,
        [currentUserId]
    );
};

exports.deleteAllPrivateChats = (currentUserId) => {
    return db.query(
        `DELETE FROM privatechat
        WHERE (receiver_id = $1)
        OR (sender_id = $1)`,
        [currentUserId]
    );
};

exports.deleteUser = (currentUserId) => {
    return db.query(
        `DELETE FROM users
        WHERE (id = $1)`,
        [currentUserId]
    );
};
