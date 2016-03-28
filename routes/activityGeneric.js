'use strict';
var https = require('https');
var activityUtils = require('./activityUtils');

exports.edit = function(req, res) {
    console.log(req.headers);
    console.log(req.body);
    activityUtils.logData(req);
    res.send(200, 'Edit');
};

exports.save = function(req, res) {
    activityUtils.logData(req);
    res.send(200, 'Save');
};

exports.publish = function(req, res) {
    activityUtils.logData(req);
    res.send(200, 'Publish');
};

exports.validate = function(req, res) {
    activityUtils.logData(req.body);
    res.send(200, 'Validate');
};

exports.execute = function(req, res) {
    console.log(req.headers);
    console.log(req.body);
    activityUtils.logData(req.body);
    res.send(200, 'Execute');
};