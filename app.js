var cookieParser = require('cookie-parser');
var compression  = require('compression');
var bodyParser   = require('body-parser');
var express      = require('express');
var session      = require('express-session');
var favicon      = require('serve-favicon');
var path         = require('path');
var app          = express();

/* 中间件 */
app.use(function(req, res, next){
  req.requestTime = (new Date()).getTime();
  next();
});
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(session({
  secret: 'xblog',
  cookie: {maxAge:86400000},//一天
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

/* 注册路由 */
app.use('/', require('./routes/index'));
app.use('/ajax', require('./routes/ajax'));
app.use('/article', require('./routes/article'));
app.use('/search', require('./routes/search'));
app.use('/admin', require('./routes/admin'));

/* 模版目录和模版引擎 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');


module.exports = app;
