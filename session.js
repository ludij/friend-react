exports.putUserInSession = function(reqSession, userDetails) {
    reqSession.user = {};
    reqSession.user.id = userDetails.id;
    reqSession.user.firstname = userDetails.firstname;
    reqSession.user.lastname = userDetails.lastname;
    reqSession.user.email = userDetails.email;
    reqSession.user.avatar_url = userDetails.avatar_url;
    reqSession.user.bio = userDetails.bio;
    reqSession.user.created_at = userDetails.created_at;
};

exports.putOtherUserInSession = function(reqSession, userDetails) {
    reqSession.otheruser = {};
    reqSession.otheruser.id = userDetails.id;
    reqSession.otheruser.firstname = userDetails.firstname;
    reqSession.otheruser.lastname = userDetails.lastname;
    reqSession.otheruser.email = userDetails.email;
    reqSession.otheruser.avatar_url = userDetails.avatar_url;
    reqSession.otheruser.bio = userDetails.bio;
    reqSession.otheruser.created_at = userDetails.created_at;
};
