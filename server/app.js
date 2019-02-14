const createError = require('http-errors');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const logger = require('morgan');

const port = 5000;

// placeholder in-memory db
const db = require("./helpers/db");
const DataHelper = require("./helpers/DataHelper")(db);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WebSocket server/handler
const aWss = expressWs.getWss('/');

// routes handlers
const legsRouter = require('./routes/legs')(DataHelper);
const stopsRouter = require('./routes/stops')(DataHelper);
const driverRouter = require('./routes/driver')(DataHelper, aWss);
const bonusDriverRouter = require('./routes/bonusDriver')(DataHelper, aWss);

// routes
app.use('/legs', legsRouter);
app.use('/stops', stopsRouter);
app.use('/driver', driverRouter);
app.use('/bonusdriver', bonusDriverRouter);

// Web Socket routes
app.ws('/', (ws, req) => {
  ws.on('message', msg => {
    console.log(aWss.clients, msg);
  })
})

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

app.listen(port, function () {
  console.log('Listening on port: ' + port + ", with websockets listener")
})
