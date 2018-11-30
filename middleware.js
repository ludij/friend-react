exports.redirectIfLoggedIn = function(req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        next();
    }
};

exports.redirectIfLoggedOut = function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/welcome');
    } else {
        next();
    }
};
