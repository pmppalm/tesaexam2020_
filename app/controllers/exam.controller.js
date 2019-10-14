var User = require('mongoose').model('User');
var Exam = require('mongoose').model('Exam');
var request = request = require('request');

exports.list = function (req, res) {
    if(req.user) {
        var score = findScore(req);
        Exam.find({}).sort({number: 'asc'}).exec(function(err, exams){
            if(err){
                return next(err);
            }
            else{
                res.render('./exam/index', {
                    title: 'Exam',
                    user: req.user ? req.user : '',
                    score: score,
                    exams: exams,
                });
            }
        });
    }
    else{
        return res.redirect('/');
    }
};

exports.info = function(req, res){
    if(req.user) {
        var score = findScore(req);
        res.render('./exam/info', {
            title: 'Exam ' + req.exam.number,
            user: req.user ? req.user : '',
            score: score,
            exam: req.exam,
            error: false
        });
    }
    else{
        return res.redirect('/');
    }
};

exports.numberByExam = function (req, res, next, number) {
    Exam.findOne({
        number: number
    }, function (err, exam) {
        if(err){
            return next(err);
        }
        else{
            req.exam = exam;
            next();
        }
    });
};

exports.read = function (req, res) {
    Exam.find({}, function(err, exams){
        if(err){
            return next(err);
        }
        else{
            res.json(exams);
        }
    });
};

exports.send = function (req, res){
    var exam = req.exam;
    var answer = req.body.answer;
    if(exam.answer == answer){
        var scores = [];
        var total = 0;
        for(var i=0; i<10; ++i){
            if(req.user.score[i] == 0 && i == req.exam.number - 1){
                scores[i] = req.exam.score;
                total += req.exam.score;
            }
            else {
                scores[i] = req.user.score[i];
                total += req.user.score[i];
            }
        }
        User.findOneAndUpdate({
            username: req.user.username
        }, {score: scores, total: total}, function (err, user) {
            if(err){
                return next(err);
            }
            else{
                return res.redirect('/exam');
            }
        });
    }
    else{
        var score = findScore(req);
        res.render('./exam/info', {
            title: 'Exam',
            user: req.user ? req.user : '',
            score: score,
            exam: exam,
            error: true
        });
    }

};

exports.create = function (req, res, next) {
    var exam = new Exam(req.body);
    exam.save(function (err) {
        if(err){
            return next(err);
        }
        else{
            res.json(exam);
        }
    });
};

function findScore(req) {
    var score = 0;
    for(var i=0; i<10; ++i){
        score += req.user.score[i];
    }
    return score;
}

exports.delete = function (req, res, next) {
    req.exam.remove(function (err) {
        if(err){
            return next(err);
        }
        else{
            res.json(req.exam);
        }
    });
};

exports.getLuke = function (req, res, next) {
    var url = 'https://swapi.co/api/people/1/'; // HTTP Request
    var json = '{"doc" : [' ;
    request({
        headers: {'content-type' : 'application/json'},
        url: url,
        method: 'GET',
        json: {'text': req.body.text}
    }, function(error, response, body){
        var str = JSON.stringify(body); // json to string
        str = str.replace("https://swapi.co/api/planets/1/", "Tatooine");
        str = str.replace("https://swapi.co/api/films/2/", "The Empire Strikes Back");
        str = str.replace("https://swapi.co/api/films/6/", "Revenge of the Sith");
        str = str.replace("https://swapi.co/api/films/3/", "Return of the Jedi");
        str = str.replace("https://swapi.co/api/films/1/", "A New Hope");
        str = str.replace("https://swapi.co/api/films/7/", "The Force Awakens");
        str = str.replace("https://swapi.co/api/species/1/", "Human");
        str = str.replace("https://swapi.co/api/vehicles/14/", "https://tgr13.herokuapp.com/vehicles/1");
        str = str.replace("https://swapi.co/api/vehicles/30/", "https://tgr13.herokuapp.com/vehicles/2");
        str = str.replace("https://swapi.co/api/starships/12/", "https://tgr13.herokuapp.com/starships/1");
        str = str.replace("https://swapi.co/api/starships/22/", "https://tgr13.herokuapp.com/starships/2");
        str = str.replace("https://swapi.co/api/people/1/", "https://tgr13.herokuapp.com/people/1");
        var x = JSON.parse(str); // string to json
        res.json(x);
    });
};

exports.getShip = function (req, res, next) {
    var url = 'https://swapi.co/api/starships/12/'; // HTTP Request
    var json = '{"doc" : [' ;
    request({
        headers: {'content-type' : 'application/json'},
        url: url,
        method: 'GET',
        json: {'text': req.body.text}
    }, function(error, response, body){
        var str = JSON.stringify(body); // json to string
        str = str.replace("https://swapi.co/api/people/1/", "Luke Skywalker");
        str = str.replace("https://swapi.co/api/people/9/", "Biggs Darklighter");
        str = str.replace("https://swapi.co/api/people/18/", "Wedge Antilles");
        str = str.replace("https://swapi.co/api/people/19/", "Jek Tono Porkins");
        str = str.replace("https://swapi.co/api/films/2/", "The Empire Strikes Back");
        str = str.replace("https://swapi.co/api/films/3/", "Return of the Jedi");
        str = str.replace("https://swapi.co/api/films/1/", "A New Hope");
        str = str.replace("https://swapi.co/api/starships/12/", "https://tgr13.herokuapp.com/starships/1");
        var x = JSON.parse(str); // string to json
        res.json(x);
    });
};

exports.getShip2 = function (req, res, next) {
    var url = 'https://swapi.co/api/starships/22/'; // HTTP Request
    var json = '{"doc" : [' ;
    request({
        headers: {'content-type' : 'application/json'},
        url: url,
        method: 'GET',
        json: {'text': req.body.text}
    }, function(error, response, body){
        var str = JSON.stringify(body); // json to string
        str = str.replace("https://swapi.co/api/people/1/", "Luke Skywalker");
        str = str.replace("https://swapi.co/api/people/13/", "Chewbacca");
        str = str.replace("https://swapi.co/api/people/14/", "Han Solo");
        str = str.replace("https://swapi.co/api/films/2/", "The Empire Strikes Back");
        str = str.replace("https://swapi.co/api/films/3/", "Return of the Jedi");
        str = str.replace("https://swapi.co/api/starships/22/", "https://tgr13.herokuapp.com/starships/2");
        var x = JSON.parse(str); // string to json
        res.json(x);
    });
};

exports.getVehicle = function (req, res, next) {
    var url = 'https://swapi.co/api/vehicles/14/'; // HTTP Request
    var json = '{"doc" : [' ;
    request({
        headers: {'content-type' : 'application/json'},
        url: url,
        method: 'GET',
        json: {'text': req.body.text}
    }, function(error, response, body){
        var str = JSON.stringify(body); // json to string
        str = str.replace("https://swapi.co/api/people/1/", "Luke Skywalker");
        str = str.replace("https://swapi.co/api/people/18/", "Wedge Antilles");
        str = str.replace("https://swapi.co/api/films/2/", "The Empire Strikes Back");
        str = str.replace("https://swapi.co/api/vehicles/14/", "https://tgr13.herokuapp.com/vehicles/1");
        var x = JSON.parse(str); // string to json
        res.json(x);
    });
};

exports.getVehicle2 = function (req, res, next) {
    var url = 'https://swapi.co/api/vehicles/30/'; // HTTP Request
    var json = '{"doc" : [' ;
    request({
        headers: {'content-type' : 'application/json'},
        url: url,
        method: 'GET',
        json: {'text': req.body.text}
    }, function(error, response, body){
        var str = JSON.stringify(body); // json to string
        str = str.replace("https://swapi.co/api/people/1/", "Luke Skywalker");
        str = str.replace("https://swapi.co/api/people/5/", "Leia Organa");
        str = str.replace("https://swapi.co/api/films/3/", "Return of the Jedi");
        str = str.replace("https://swapi.co/api/vehicles/30/", "https://tgr13.herokuapp.com/vehicles/2");
        var x = JSON.parse(str); // string to json
        res.json(x);
    });
};

exports.postRequest = function (req, res, next) {
    if(req.body.name == "muzic"){
        res.send("cpsu");
    }
    else{
        res.send("lucky");
    }
};

exports.getRequest = function (req, res, next) {
    res.send("Correct");
};

exports.getJson = function (req, res, next) {
    res.send('{ "name":"John", "age":30, "cars": [ { "name":"Ford", "models":[ "Fiesta", "Focus", "Mustang" ] }, { "name":"BMW", "models":[ "320", "X3", "X5" ] }, { "name":"Fiat", "models":[ "500", "Panda" ] } ] }');
    // var url = 'https://swapi.co/api/people/4/'; // HTTP Request
    // var json = '{"doc" : [' ;
    // request({
    //     headers: {'content-type' : 'application/json'},
    //     url: url,
    //     method: 'GET',
    //     json: {'text': req.body.text}
    // }, function(error, response, body){
    //     var str = JSON.stringify(body); // json to string
    //     str = str.replace("https://swapi.co/api/planets/1/", "Tatooine");
    //     str = str.replace("https://swapi.co/api/films/2/", "The Empire Strikes Back");
    //     str = str.replace("https://swapi.co/api/films/6/", "Revenge of the Sith");
    //     str = str.replace("https://swapi.co/api/films/3/", "The Empire Strikes Back");
    //     str = str.replace("https://swapi.co/api/films/1/", "A New Hope");
    //     str = str.replace("https://swapi.co/api/species/1/", "Human");
    //     str = str.replace("https://swapi.co/api/starships/13/", "TIE Advanced x1");
    //     str = str.replace("https://swapi.co/api/people/4/", "https://tgr13.herokuapp.com/people/2");
    //     var sw = JSON.parse(str); // string to json
    //     res.send(sw);
    // });
};