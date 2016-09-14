'use strict';

/**
 * 1、从请求头里面拿到token，和redis里面的token做比对，看是否过期
 * 2、比对token对应的userId，更新相应的token，
 * 3、查看是否是没有正常退出，重新登录，对旧的token做过期或者删除操作
 * 
 */

var redis = require('../redis/redis-server');
var login = require('../login_authority/create-token');
var token = require('../token/token');
var address = require('config').address.formal;
var querystring= require('querystring');



var isLo = {

  isLogin : function (req, res) {

    if (req.cookies.token === undefined) {
        
      login(req, res).then(function (obj) {
          
          var user = obj.data,
          appChannel = obj.appChannel;
        
          res.json({
            'access_token': token.wriToken(user, appChannel, res),
            'success': true,
            'user' : user
          });
        
        })
        .catch(function (data) {
          return res.json(data);

        })

      }
  }

}

module.exports = isLo;


