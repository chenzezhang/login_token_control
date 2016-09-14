'use strict';
/**
 * 
 * 请求（地址，参数）直接代理到后台
 * 
 */

var request = require('request');
var errorMsg = require('config').errorMsg;

var logs = require('../logs');


var response = {

    agent: function (method, url, body, res, req) {
        
        var method = method.toLowerCase();

        request[method]({ url: url, form: body }, function (error, response, body) {
  
            try {

                body = JSON.parse(body);

            } catch (error) {

            }

            if (error) {
                
                var code = 500;

                if (response) {
                    code = response.statusCode;
                }
                res.json({ 'data': null, 'code': code, 'msg': errorMsg.msg, 'success': false });

                logs.logErr(req);
                
            } else if (response.statusCode == 200) {

                if (body.success) {

                    var code = body.code,
                        msg = body.msg,
                        success = body.success;

                    res.json({'data' : body.data, 'code' : code, 'msg' : msg, 'success' : success});

                } else {

                    res.json(body);
               
                }

            }

        });
       
     }

}


module.exports = response;

