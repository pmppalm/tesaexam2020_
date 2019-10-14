module.exports = function (app) {
    var exam = require('../controllers/exam.controller');

    app.route('/exam')
        .get(exam.list);

    app.route('/exam/create')
        .post(exam.create);
    app.route('/exam/read')
        .get(exam.read);

    app.route('/exam/:number')
        .get(exam.info)
        .delete(exam.delete);

    app.route('/exam/send/:number')
        .post(exam.send);

    app.param('number', exam.numberByExam);

    app.route('/people/1')
        .get(exam.getLuke);
    app.route('/starships/1')
        .get(exam.getShip);
    app.route('/starships/2')
        .get(exam.getShip2);
    app.route('/vehicles/1')
        .get(exam.getVehicle);
    app.route('/vehicles/2')
        .get(exam.getVehicle2);

    app.route('/request')
        .post(exam.postRequest)
        .get(exam.getRequest);

    app.route('/product/2')
        .get(exam.getJson)

};