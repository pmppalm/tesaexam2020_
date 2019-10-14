var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function () {
    passport.use(new LocalStrategy(function(username, password, done) { // Verify Callback
        User.findOne({username: username},  function (err, user) {
            if(err){
                return done(err);
            }
            if(!user || !user.authenticate(password)){
                return done(null, false,{
                    message: 'Inavalid username or password'
                });
            }
            return done(null, user);
        });
    }));
};