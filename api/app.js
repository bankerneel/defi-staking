const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const isWebAuth = require('./middleware/is-web-auth');
const isAdminAuth = require('./middleware/is-admin-auth');

const indexRouter = require('./routes/index.routes.js');
const dashboardRouter = require('./routes/dashboard.routes.js');
const adminRouter = require('./routes/admin/index.routes.js');
const transactionRouter = require('./routes/admin/transaction.routes');
const settingsRouter = require('./routes/admin/settings.routes');

const app = express();

// caching disabled for every route
const options = {
  key: fs.readFileSync('./defy.key'),
  cert: fs.readFileSync('./certificate.crt'),
};

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(session({
  secret: 'DeFiXyProject',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   path: "/",
  //   httpOnly: false,
  //   secure: false,
  //   maxAge: 31536000000,
  // },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Web routes
app.use('/', indexRouter);
app.use('/dashboard', isWebAuth, dashboardRouter);

// Admin routes
app.use('/admin', adminRouter);
app.use('/admin/transaction', isAdminAuth, transactionRouter);
app.use('/admin/settings', isAdminAuth, settingsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  //   res.status(err.status || 500);
  if (err.status == 404) {
    res.render('error', {
      title: '',
      activeBar: '',
      session: [],
    });
  }
});

module.exports = app;
https.createServer(options, app).listen(3000);
