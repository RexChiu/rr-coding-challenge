var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// placeholder in-memory db
const db = require("./helpers/db");
const DataHelper = require("./helpers/DataHelper")(db);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes handlers
var legsRouter = require('./routes/legs')(DataHelper);
var stopsRouter = require('./routes/stops')(DataHelper);
var driverRouter = require('./routes/driver')(DataHelper);
var bonusDriverRouter = require('./routes/bonusDriver')(DataHelper);

// routes
app.use('/legs', legsRouter);
app.use('/stops', stopsRouter);
app.use('/driver', driverRouter);
app.use('/bonusdriver', bonusDriverRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
