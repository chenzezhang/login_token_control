'use strict';

/**
 * 由于后台接口分为读写分离，需要请求的时候单独处理
 * 
 */


var config = require('config');
var request = require('sync-request');
var lad = require('lodash');
var agent = require('./middlewares/agent');
var querystring = require('querystring');


function Map(){
  this.container = new Object();
}

Map.prototype.set = function(key, value){
  this.container[key] = value;
}

var endpoint = config.address.formal,
    rulesApi = '/api/v2/queryInterfaceIp',
    reg_parseListUrl = /({[a-zA-Z]+})/g,
    reg_parseUrl = /(\/[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12})|(\/\d+)/g,
    requestUrl,
    LOAD_RULES = false,
    map = new Map();


module.exports = function (req, res, next) {

  var method, url, body, _res = res, _req = req;
  
  // 关闭规则，则直接返回旧的处理方式
  if (!config.openApiRules) {
   
      method = req.method,
      url = endpoint + req.url,
      body = querystring.stringify(req.body);
    
      return agent.agent(method, url, body, _res, _req);
  }

  if (!LOAD_RULES) {

    var res = request('GET', endpoint + rulesApi);

    if (res.statusCode !== 200) {
      throw new Error("Notice: /api/v2/queryInterfaceIp 接口请求失败\n");
    }

    var list = JSON.parse(res.getBody());


    lad.forEach(list, function (val, key) {
        map.set(key.replace(reg_parseListUrl, ''), val);
    });
    
    LOAD_RULES = map.container;
  }
 
  requestUrl = req._parsedUrl.pathname.replace(reg_parseUrl, '/');//处理请求路径


  if (LOAD_RULES[requestUrl]) {
    endpoint = config[LOAD_RULES[requestUrl]];
  } else {
    endpoint = config.WRITE;
  }
   console.log(endpoint)
  
  if (process.env.NODE_APP_INSTANCE === 'uat') {
    console.log('req-url:      ', req.url);
    console.log('parsed-url:   ', requestUrl);
    console.log('metch-host:   ', LOAD_RULES[requestUrl]);
    console.log('host-address: ', endpoint);
    console.log("\n");
  }

    method = req.method,
    url = endpoint + req.url,
    body = querystring.stringify(req.body);

    agent.agent(method, url, body, _res, _req);

};

