const express = require('express');
const router = express.Router();
const {redirectIfLoggedOut} = require('./middleware');
const db = require('./db.js');
const session = require('./session.js');
const auth = require('./auth.js');
const {upload} = require('./s3.js');

exports.routerLoggedIn = router;

router.get('/', redirectIfLoggedOut, (req, res) =>
    res.sendFile(__dirname + '/index.html')
);

router.get('/profile', redirectIfLoggedOut, (req, res) =>
    res.json(req.session.user)
);

router.get('/profile/:id', redirectIfLoggedOut, (req, res) => {
    if (req.params.id == req.session.user.id)
        return res.json({success: false});
    db.selectUserById(req.params.id)
        .then(otherUserDetails => {
            if (!otherUserDetails)
                return res.json({success: false});
            session.putOtherUserInSession(req.session, otherUserDetails.rows[0]);
            res.json(otherUserDetails.rows[0]);
        })
        .catch(err => {
            console.log('error in app.get /profile/:id : ', err);
            res.json({success: false});
        });
});

router.get('/friends/all', redirectIfLoggedOut, (req, res) => {
    db.getFriends(req.session.user.id)
        .then(friends => {
            res.json(friends.rows);
        })
        .catch(err => {
            console.log('error in app.get /friends/all : ', err);
            res.json({success: false});
        });
});

router.get('/friends/:id', redirectIfLoggedOut, (req, res) => {
    db.getFriendship(req.params.id, req.session.user.id)
        .then(result =>
            res.json(result)
        )
        .catch(err => {
            console.log('error in app.get /friends/:id : ', err);
            res.json({success: false});
        });
});

router.get('/logout', redirectIfLoggedOut, (req, res) => {
    req.session = null;
    res.redirect('/welcome');
});

router.get('*', redirectIfLoggedOut, (req, res) =>
    res.sendFile(__dirname + '/index.html')
);

router.post('/upload-avatar', redirectIfLoggedOut, auth.multerWithErrorReturn, upload, (req, res) => {
    db.updateAvatar(req)
        .then(userDetails => {
            session.putUserInSession(req.session, userDetails.rows[0]);
            res.json(userDetails.rows);
        })
        .catch(err => {
            console.log('error in post /upload-avatar:', err);
            return res.json([{success: false}]);
        });
});

router.post('/bio', redirectIfLoggedOut, (req, res) => {
    db.updateBio(req)
        .then(userDetails => {
            session.putUserInSession(req.session, userDetails.rows[0]);
            res.json(userDetails.rows);
        })
        .catch(err => {
            console.log('error in post /bio:', err);
            return res.json([{success: false}]);
        });
});

router.post('/friends-request/:otherUserId', redirectIfLoggedOut, (req, res) => {
    db.insertFriendsRequest(req.session.user.id, req.params.otherUserId)
        .then(result =>
            res.json(result.rows)
        )
        .catch(err => {
            console.log('error in post /friends-request/otherUserId :', err);
            return res.json([{success: false}]);
        });
});

router.post('/friends-accept/:otherUserId', redirectIfLoggedOut, (req, res) => {
    db.updateFriendsAccept(req.session.user.id, req.params.otherUserId)
        .then(result =>
            res.json(result.rows)
        )
        .catch(err => {
            console.log('error in post /friends-accept/otherUserId :', err);
            return res.json([{success: false}]);
        });
});

router.post('/friends-end/:otherUserId', redirectIfLoggedOut, (req, res) => {
    db.deleteFriends(req.session.user.id, req.params.otherUserId)
        .then(result =>
            res.json(result)
        )
        .catch(err => {
            console.log('error in post /friends-end:', err);
            return res.json([{success: false}]);
        });
});

router.post('/profile/delete', redirectIfLoggedOut, (req, res) => {
    console.log("trying to delete", req.session.user.id);
    Promise.all([
        db.deleteAllFriends(req.session.user.id),
        db.deleteAllChats(req.session.user.id),
        db.deleteAllPrivateChats(req.session.user.id)
    ])
        .then(() => {
            console.log("deleting user");
            return db.deleteUser(req.session.user.id);
        })
        .then(() => {
            console.log("removing cookies");
            req.session = null;
            // res.redirect('/welcome'); // doesn't work
            return res.json([{success: true}]);
        })
        .catch(err => {
            console.log('error in post /profile/delete:', err);
            return res.json([{success: false}]);
        });
});
