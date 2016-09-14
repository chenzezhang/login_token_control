'use strict';

var redis = require('../redis/redis-server');
var crypt = require('../token/ctypto').crypt;
var limit = require('config').loan;
var agent = require('../middlewares/agent');
var errorMsg = require('config').errorMsg;

/**
 * 
 * 对投资接口进行防刷限制
 * 规定time秒以内访问
 * 是否需要添加次数来限制
 * 
 */

var loan = {

    limiting: function (loanId, userId, res, method, url, body) {

        var obj = {
            'loanId': loanId,
            'userId': userId
        }

        obj.createdAt = Date.now();

        var loanId = crypt.creatToken(obj);

        redis.get(loanId).then(function (value) {

            if (!value) {
                redis.set(loanId, 'isloan', 'EX', limit.loanTime);
                //代理到后台

                agent.agent(method, url, body, res, req);

            } else {
                res.statusCode = errorMsg.code;    

                return res.end(JSON.stringify({
                    'data': null,
                    'code': errorMsg.code,
                    'msg': errorMsg.msg,
                    'success': false,
                }))

            }

        })
    }
}



module.exports = loan;

