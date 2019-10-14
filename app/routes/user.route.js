module.exports = function (app) {
    var user = require('../controllers/user.controller');
    var passport = require('passport');

    app.route('/')
        .get(user.renderLogin)
        .post(passport.authenticate('local',{
            successRedirect: '/exam',
            failureRedirect: '/',
            failureFlash: true
        }));
    app.route('/register')
        .get(user.renderRegister)
        .post(user.register);
    app.post('/logout', user.logout);

    app.route('/show/score')
        .get(user.showScore);

    app.get('/read', user.read);
    app.get('/read/:username', user.readOne);

    app.put('/edit/:username', user.editOne);

    app.delete('/delete/:username', user.deleteOne);

    app.param('username', user.userByUsername);
};