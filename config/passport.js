var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function () {
    var User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    }); // authenticate เสร็จ ใช้ ี user.id เป็น Session โดยเก้บเข้า cookie

    passport.deserializeUser(function(id, done) {
        User.findOne({_id: id}, '-password -salt', function (err, user) {
            done(err, user);
        });
    }); // เมื่อต้องใช้ user จะใช้ id ดึง user มาจาก Database
    require('./strategies/local')();
};