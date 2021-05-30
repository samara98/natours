const express = require('express');
const path = require('path');
const cors = require('cors');
// const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const router = require('./router');
const errorHandler = require('./utils/error-handler');

const app = express();

app.enable('trust proxy');

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(cors());
// app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
if (app.get('env') !== 'production')
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'public')));
if (app.get('env') === 'production')
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

app.use('/', router);

if (app.get('env') === 'production')
  app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
  });

app.use(...errorHandler, async (req, res) => {
  return res.render('error');
});

module.exports = app;
