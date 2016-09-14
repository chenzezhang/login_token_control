'use strict';

var crypto;

/** 
 * crypto 加密模块
 * 
 * crypto.randomBytes(size, [callback])
 * 生成随机字符串
 */

crypto = require('crypto');

var crypt = exports.crypt = {};

crypt.creatToken = function (obj) {

    return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
    
};
