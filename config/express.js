var config = require('./config');

var express = require('express'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    validtor = require('express-validator'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport');

module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    else {
        app.use(compression);
    }
    app.use(session({
        secret: 'config.sessionSecret',
        resave: false,
        saveUninitialized: true
    }));
    app.use(flash());
    app.use(passport.initialize()); // เริ่มการทำงานของ Passport
    app.use(passport.session()); // ใช้ session โดยอาศัย express-session

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(validtor());

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    require('../app/routes/user.route')(app);
    require('../app/routes/exam.route')(app);

    app.use(express.static('./public'));

    const extendTimeoutMiddleware = (req, res, next) => {
        const space = ' ';
        let isFinished = false;
        let isDataSent = false;
      
        // Only extend the timeout for API requests
        if (!req.url.includes('/api')) {
          next();
          return;
        }
      
        res.once('finish', () => {
          isFinished = true;
        });
      
        res.once('end', () => {
          isFinished = true;
        });
      
        res.once('close', () => {
          isFinished = true;
        });
      
        res.on('data', (data) => {
          // Look for something other than our blank space to indicate that real
          // data is now being sent back to the client.
          if (data !== space) {
            isDataSent = true;
          }
        });
      
        const waitAndSend = () => {
          setTimeout(() => {
            // If the response hasn't finished and hasn't sent any data back....
            if (!isFinished && !isDataSent) {
              // Need to write the status code/headers if they haven't been sent yet.
              if (!res.headersSent) {
                res.writeHead(202);
              }
      
              res.write(space);
      
              // Wait another 15 seconds
              waitAndSend();
            }
          }, 15000);
        };
      
        waitAndSend();
        next();
      };
      
      app.use(extendTimeoutMiddleware);
    return app;
};