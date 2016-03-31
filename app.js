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
var configjson  = require('./public/ixn/activities/generic/config.json');

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
app.get( '/ixn/activities/generic/config.json', function( req, res ) {
    var appName = 'activityAppName';
    var actKey = 'appcenterKey';
    var actName = 'activityName';
    var actDesc = 'activityDescription';
    var search = new RegExp('{{'+appName+'}}', 'g');
    var json = JSON.parse(JSON.stringify(configjson));
    json.arguments.execute.url = configjson.arguments.execute.url.replace(search,process.env[appName]);
    json.arguments.execute.useJwt = process.env.jwtUse;
    json.arguments.execute.customerKey = process.env.jwtExternalKey;
    json.configurationArguments.save.url = configjson.configurationArguments.save.url.replace(search,process.env[appName]);
    json.configurationArguments.save.useJwt = process.env.jwtUse;
    json.configurationArguments.save.customerKey = process.env.jwtExternalKey;
    json.configurationArguments.publish.url = configjson.configurationArguments.publish.url.replace(search,process.env[appName]);
    json.configurationArguments.publish.useJwt = process.env.jwtUse;
    json.configurationArguments.publish.customerKey = process.env.jwtExternalKey;
    json.configurationArguments.validate.url = configjson.configurationArguments.validate.url.replace(search,process.env[appName]);
    json.configurationArguments.validate.useJwt = process.env.jwtUse;
    json.configurationArguments.validate.customerKey = process.env.jwtExternalKey;
    json.edit.url = configjson.edit.url.replace(search,process.env[appName]);
    search = new RegExp('{{'+actKey+'}}', 'g');
    json.configurationArguments.applicationExtensionKey = configjson.configurationArguments.applicationExtensionKey.replace(search,process.env[actKey]);
    search = new RegExp('{{'+actName+'}}', 'g');
    json.lang['en-US'].name = configjson.lang['en-US'].name.replace(search,process.env[actName]);   
    search = new RegExp('{{'+actDesc+'}}', 'g');
    json.lang['en-US'].description = configjson.lang['en-US'].description.replace(search,process.env[actDesc]); 
    res.status(200).send( json );
});
app.post('/getActivityData', function(req, res) {
    res.sendfile(path.join(__dirname,'/views/ws-viewer.html'));
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
app.get('/dave',function(req,res){
    res.render("index");
});