'use strict';

var redis = require('../redis/redis-server');
var address = require('config').address.formal;
var agent = require('./agent');
var querystring = require('querystring');
var loan = require('../loan/loan');
var config = require('config').loan;

/**
 * 地址栏截取到MYSELF，拿着请求头中的token去redis中查找相应的userId,替换掉
 * 
 */

var getUrl = {

    replaceUrl: function (req, res, next) {
        
        var isYes, token;
        
        if (req.url.indexOf('/MYSELF') < 0) {
            isYes = false;
            return next(isYes, req);

        } else {

            token = req.cookies.token;

            if (token === undefined) {

                isYes = false;
                
                //去走登录
                return next(isYes, req);
            
            } else {

                token = token;

                redis.get(token).then(function (value) {

                    redis.pttl(value).then(function (time) {

                        if (time == '-1' || time == '-2') {

                            return next();

                        } else {

                            /**
                             * 用正则匹配MYSELF，替换为redis中拿到的userId
                             */

                            var str = req.url.match(/MYSELF/g),
                            str = req.url.replace(str, value), 
                            method = req.method,
                            url = address + str,
                            body = querystring.stringify(req.body);

                            /**
                             * 判断
                             *  req.params.loanId 存在和 default里面的开关开启 
                             */
                            
                            if (req.params.loanId != "undefined" && config.openLoan) {

                                loan.limiting(req.params.loanId, value, res, method, url, body, req)
                            } else {

                                //代理到后台
                                agent.agent(method, url, body, res, req);

                            }
                            
                        }

                    })
                })

            }

        }

    }


}


module.exports = getUrl;


