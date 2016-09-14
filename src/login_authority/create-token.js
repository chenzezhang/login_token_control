'use strict';

var _Promise = require('bluebird');
var address = require('config').address.formal;
var request = require('request');
var errorMsg = require('config').errorMsg;

module.exports = function (req, res) {

    var api = req.url;
    var appChannel = req.body.appChannel;
    var resolver = _Promise.defer();

    request.post({url:address + api,form:req.body}, function(err, response, body){
        
       try {
           body = JSON.parse(body);
       } catch (error) {
           
       }
       
        if(err){
            var code = 500;
            if (response) {
                code = response.statusCode;
            }
            
            resolver.reject({'data' : null, 'code' : code, 'msg' : errorMsg.msg, 'success' : 'false'});

        }else if(response.statusCode == 200 ){

            if(body.success){
  
                resolver.resolve({data:body.data, appChannel:appChannel});

            }else{

                resolver.reject(body);

            } 
        }
    
    })

    return resolver.promise;

}


















