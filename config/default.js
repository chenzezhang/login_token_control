'use strict';

module.exports = {

    redis: "redis://127.0.0.1:6379", 

    /**
     * 关于投资接口，限时投资时间开关
     * loanTime redis 需要毫秒
     * 一般情况下,openLoan 为打开状态。
     */
    loan: {
        openLoan : true,
        loanTime : 1, 
    },

    /**
     * token 时间有效期判断
     */

    token: {
        time: 30 * 24 * 60 * 60
    },

    /**
     * public error msg
     */

    errorMsg: {
        msg: '服务器错误',
        code: 403
    },

    openApiRules: false // 打开api代理规则(读写分离)

               

}

