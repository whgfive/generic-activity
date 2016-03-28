'use strict';
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var bodyParser  = require('body-parser');
var jwtAuth = require('./lib/jwtDecoder');
var routes = require('./routes');
var activityGeneric = require('./routes/activityGeneric');
var activityUtils = require('./routes/activityUtils');
var pkgjson = require('./package.json');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'application/jwt' }));
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(express.methodOverride());
app.use(express.favicon());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

global.io = require('socket.io')(server);

app.get('/', routes.index);
app.post('/login', routes.login);
app.post('/logout', routes.logout);
app.post('/ixn/activities/generic/save/', jwtAuth, activityGeneric.save);
app.post('/ixn/activities/generic/validate/', jwtAuth, activityGeneric.validate);
app.post('/ixn/activities/generic/publish/', jwtAuth, activityGeneric.publish);
app.post('/ixn/activities/generic/execute/', jwtAuth, activityGeneric.execute);
app.get('/getActivityData', function(req, res) {
    res.sendfile(path.join(__dirname+'/public/ws-viewer.html'));
    //res.send( 200, {data: activityUtils.logExecuteData} );
    /*if( !activityUtils.logExecuteData.length) {
        res.send( 200, {data: null} );
    } else {
        res.send( 200, {data: activityUtils.logExecuteData} );
    }*/
});
app.get('/clearList', function(req, res) {
    res.send(200, { data: activityUtils.logExecuteData });
});
app.get('/version', function(req, res) {
    res.setHeader('content-type', 'application/json');
    res.send(200, JSON.stringify({
        version: pkgjson.version
    }));
});