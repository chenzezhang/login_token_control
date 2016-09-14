'use strict';

var crypt = require('../token/ctypto').crypt;
var redis = require('../redis/redis-server');
var config = require('config').token;


/** 
 * 创建token对象
 */

var token = {

    wriToken : function(obj, appChannel, res) {

        obj.createdAt = Date.now();

        var token = crypt.creatToken(obj);

        redis.get(obj.userId).then(function (value) {

            var _obj;

            if (value) {
                _obj = JSON.parse(value);

            } else {

                _obj = {};
            }

            if (_obj[appChannel]) {
                redis.del(_obj[appChannel]);
            }

            _obj[appChannel] = token;

            redis.set(obj.userId, JSON.stringify(_obj), 'EX', config.time);

        })
            
            redis.set(token, obj.userId, 'EX', config.time);

            res.cookie('token', token, { httpOnly: true });
         
            return token;

    }

}



module.exports = token;
