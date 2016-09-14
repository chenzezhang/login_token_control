'use strict';


/**
 *
 * 兼容现有的访问V2接口，实际访问的是v4或者其他的接口。
 * 在全部转换为V4接口之前，要使用这个。
 */

module.exports = function (fn) {
    return function (req, res, next) {
        fn(req);
        return next();
    };
};
