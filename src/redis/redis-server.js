'use strict';

var config = require('config');
var redis = require('ioredis');

if (config.redis) {
    if (config.redis.clusterNodes) {
        var clusterNodes = config.redis.clusterNodes;  //用作集群处理
        delete config.redis.clusterNodes;
        module.exports = new Redis.Cluster(clusterNodes, config.redis); 
    } else {
        module.exports = new redis(config.redis); 
    }
}

