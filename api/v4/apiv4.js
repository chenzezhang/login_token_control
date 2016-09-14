'use strict';
/**
 *
 * 权限控制看src/oauth2/oauth2-oauth.js
 */

module.exports = function (router, auth, routAdress, apiPass) {

    router.get('这里填写你们的接口', auth.pass());


};
