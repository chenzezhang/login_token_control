'use strict';

/**
 * 统计错误日志，发给日志服务
 */
var express = require('express');

var request = require('request');


var logUrl = require('config').logs;
var api = '/log/error'


var erras = {

    logErr: function (req, res, next) { 

        request.post({ url: logUrl + api, form: req }, function () { })

    }    
}



module.exports = erras;



