var User = require('mongoose').model('User');

var getErrorMessage = function(err){
    var message = '';
    if(err.code){ // Index Error คือ
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists'; // Username ซ้ำ
                break;
            default:
                message = 'Something went wrong'; // มีบางอย่างผิดพลาด
        }
    }
    else{ // Validation Error
        for (var errName in err.errors){
            if(err.errors[errName].message){
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

exports.renderLogin = function (req, res) {
    if(!req.user) {
        res.render('index', {
            title: 'Index',
            errors: req.flash('error')
        });
    }
    else{
        return res.redirect('/exam');
    }
};

exports.renderRegister = function (req, res, next) {
    if(!req.user) {
        res.render('register', {
            'title': 'Register',
            'errors': req.flash('error')
        });
    }
    else{
        return res.redirect('/exam');
    }
};

exports.register = function (req, res, next) {
    if(!req.user){
        var user = new User(req.body);
        user.provider = 'local';
        user.score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        user.save(function (err) {
            if(err){
                var message = getErrorMessage(err); // err จาก mongoose
                req.flash('error', message);

                return res.redirect('/register');
            }
            req.login(user, function (err) {
                if(err){
                    return next(err);
                }
                return res.redirect('/exam');
            });
        });
    }
    else{
        return res.redirect('/exam');
    }
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.read = function (req, res, next) {
    User.find({}, function(err, users){
        if(err){
            return next(err);
        }
        else{
            res.json(users);
        }

    });
};

exports.readOne = function (req, res, next) {
    res.json(req.user);
};

exports.userByUsername = function (req, res, next, username) {
    User.findOne({
        username: username
    }, function (err, user) {
        if(err){
            return next(err);
        }
        else{
            req.user = user;
            next();
        }
    });
};

exports.editOne = function (req, res, next) {
    User.findOneAndUpdate({
        username: req.user.username
    }, req.body, function (err, user) {
        if(err){
            return next(err);
        }
        else{
            res.json(user);
        }
    });
};

exports.deleteOne = function (req, res, next) {
    req.user.remove(function (err, user) {
        if(err){
            return next(err);
        }
        else{
            res.json(req.user);
        }
    });
};

exports.showScore = function (req, res, next) {
    User.find({}).sort({total: 'desc'}).exec(function(err, users){
        if(err){
            return next(err);
        }
        else{
            res.render('score', {
                title: 'Score',
                users: users
            });
        }
    });
};