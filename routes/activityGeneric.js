'use strict';
var https = require('https');
var activityUtils = require('./activityUtils');

exports.edit = function(req, res) {
    console.log("Header:"+JSON.stringify(req.headers));
    console.log("Body:"+JSON.stringify(req.body));
    activityUtils.logData(req);
    res.send(200, 'Edit');
};

exports.save = function(req, res) {
    console.log("Header:"+JSON.stringify(req.headers));
    console.log("Body:"+JSON.stringify(req.body));
    activityUtils.logData(req);
    res.send(200, 'Save');
};

exports.publish = function(req, res) {
    console.log("Header:"+JSON.stringify(req.headers));
    console.log("Body:"+JSON.stringify(req.body));
    activityUtils.logData(req);
    res.send(200, 'Publish');
};

exports.validate = function(req, res) {
    console.log("Header:"+JSON.stringify(req.headers));
    console.log("Body:"+JSON.stringify(req.body));
    activityUtils.logData(JSON.stringify(req.body));
    res.send(200, 'Validate');
};

exports.execute = function(req, res) {
    console.log("Header:"+JSON.stringify(req.headers));
    console.log("Body:"+JSON.stringify(req.body));
    activityUtils.logData(JSON.stringify(req.body));
    res.send(200, 'Execute');
};