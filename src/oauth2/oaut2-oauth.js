'use strict';

var config = require('config');

var login = require('../middlewares/isLogin');
var getUrl = require('../middlewares/myself');
var address = require('config').address.formal;
var querystring = require('querystring');
var redis = require('../redis/redis-server');
var errorMsg = require('config').errorMsg;
var apiPass = require('../api-pass');

//设置oa为全局oauth对象,并初始化oa

var oa = exports.oa = {};

/** 
 * 权限控制（暂时分为两个权限)
 * 1、直接通过  pass
 * 2、带有userId的通过   user
 * 3、退出 logout
 */

oa.pass = function () {

    return function (req, res, next) {

        req.authPass = true;

        apiPass()(req, res, next);

    }

}

oa.user = function (Say) {

    return function (req, res, next) {
       
        if (typeof Say == 'string') {
            login.isLogin(req, res);
        } else {
            getUrl.replaceUrl(req, res, function (isYes, req) {

                if (!isYes) {
                    res.statusCode = errorMsg.code;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');

                    res.end(JSON.stringify({
                        'data': null,
                        'code': errorMsg.code,
                        'msg': errorMsg.msg,
                        'success': false,
                    }))
                }
            });

        }
    }
}

oa.logout = function () {

    return function (req, res, next) {
       
        res.clearCookie('token');

        redis.get(req.cookies.token).then(function (value) {

          redis.del(req.cookies.token);

          redis.del(value);
        })

        res.end(JSON.stringify({
            'data': null,
            'code': 200,
            'msg': '退出',
            'success': true,
        }))
    }
}