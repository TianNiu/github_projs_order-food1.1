/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    ejs = require('ejs'),
    path = require('path');
//路由嵌套命名package
var namespace = require('express-namespace');
//express-resource 暂停使用
//var resource = require('express-resource');
//使用express-resource-new  未进行下去
var Resource = require('express-resource-new');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
app.set('controllers', __dirname + '/routes');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
/**
 * 引入路由器 传统分发路由方式
 * @type {[type]}
 */
// var router = require('./router');
// router.get(app);
// router.post(app);

/**
 * resourceful 路由方式
 */
require('./router').main(app);


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
