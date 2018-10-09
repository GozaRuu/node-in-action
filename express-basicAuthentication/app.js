if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//basic authentification
const basicAuth = (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.authorization; //will be in the form of : 'Basic YWRtaW46YWRtaW4='
    if(!authHeader) { //this case have to handled separately
        const err = new Error('Access not authorized');
        res.setHeader('WWW-Authenticate', 'Basic'); //set authentication type to 'Basic'
        err.status = 401;
        return next(err);
    }

    try {
        const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':'); // take take the token and decode it from base64
        //the decoded string is admin:admin split by ':' and check for user credential
        const username = auth[0];
        const password = auth[1];
        if (username === 'admin' && password === 'admin') {
            next();
        } else {
            const err = new Error('Access not authorized');
            res.setHeader('WWW-Authenticate', 'Basic'); //set authentication type to 'Basic'
            err.status = 401;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
};
app.use(basicAuth);

//route
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
