const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const bcrypt = require('bcryptjs');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

exports.hashPassword = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        if (plainTextPassword == "") {
            return resolve("");
        }
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

exports.checkPassword = function(plainTextPassword, hash) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(plainTextPassword, hash, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve({doesMatch});
            }
        });
    });
};

exports.multerWithErrorReturn = function(req, res, next) {
    uploader.single("file")(req, res, function(err) {
        if (err) return res.json([{success: false}]);
        else {
            next();
        }
    });
};
