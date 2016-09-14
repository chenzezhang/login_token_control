"use strict";
var http = require('http');
var proxy = require('http-proxy-simple');
var apiRules = require('./api-rules');
var errorMsg = require('config').errorMsg;


/**
 * 接口读写分离
 */

http.globalAgent.maxSockets = Infinity;
require('https').globalAgent.maxSockets = Infinity;

module.exports = function () {
    
    return function (req, res, next) {

        req.apiPass = req.apiPass === true || req.apiPass === false ? req.apiPass : req.authPass;
        
        if (req.apiPass === true) {
            // 引入api规则处理，主要是做读写分离
            apiRules(req, res, next);
            //proxy(endpoint, opts)(req, res, next);
        } else if (req.apiPass === false) {
            res.statusCode = errorMsg.code;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({
                'data': null,
                'success': false,
                'msg': errorMsg.meg,
                'code' : errorMsg.code
            }));
        } else {
            next();
        }
    };

}  
