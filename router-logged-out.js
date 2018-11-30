const express = require('express');
const router = express.Router();
const {redirectIfLoggedIn} = require('./middleware');
const db = require('./db.js');
const session = require('./session.js');
const auth = require('./auth.js');

exports.routerLoggedOut = router;

router.get('/welcome', redirectIfLoggedIn, (req, res) =>
    res.sendFile(__dirname + '/index.html')
);

router.post('/welcome', redirectIfLoggedIn, (req, res) => {
    auth.hashPassword(req.body.password)
        .then(hash => {
            return db.insertUser(req.body, hash);
        })
        .then(userDetails => {
            session.putUserInSession(req.session, userDetails.rows[0]);
            res.json({success: true});
        })
        .catch(err => {
            console.log('error in app.post /welcome: ', err);
            res.json({success: false});
        });
});

router.post('/login', redirectIfLoggedIn, (req, res) => {
    let userData = {};
    db.selectUser(req.body.email)
        .then(userDetails => {
            userData = userDetails;
            return auth.checkPassword(req.body.password, userDetails.rows[0].password);
        })
        .then(resolve => {
            if (resolve.doesMatch) {
                session.putUserInSession(req.session, userData.rows[0]);
                res.json({success: true});
            } else {
                res.json({success: false});
            }
        })
        .catch(err => {
            console.log('error in post /login: ', err);
            res.json({success: false});
        });
});
