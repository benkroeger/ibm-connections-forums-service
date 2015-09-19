'use strict';

// native node modules
var util = require('util');

// 3rd party modules
var _ = require('lodash');
var OniyiHttpClient = require('oniyi-http-client');

// internal modules
var parsers = require('./parsers');


function IbmConnectionsForumsService(baseUrl, options) {

  options = _.merge({
    requestOptions: {
      headers: {}
    },
    ttl: {
      profileEntry: false,
      networkState: 300
    }
  }, options, {
    requestOptions: {
      baseUrl: baseUrl,
      followRedirect: false
    }
  });

  OniyiHttpClient.call(this, options);
  this._options = options;
}

util.inherits(IbmConnectionsForumsService, OniyiHttpClient);


IbmConnectionsForumsService.prototype.getForum = function getForum(params, callback) {
  var self = this;

  var qsValidParameters = [
    'forumUuid'
  ];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    uri: '/forums/atom/forum',
    qs: _.pick(params, qsValidParameters),
    headers: {
      accept: 'application/atom+xml'
    }
  });

  self.makeRequest(requestOptions, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    // @TODO: validate response
    // status codes: 200, 401, 404
    // header content-type: application/atom+xml

    parsers.forum(body, function (err, forum) {
      if (err) {
        return callback(err);
      }
      return callback(null, forum);
    });
  });
};

IbmConnectionsForumsService.prototype.getTopic = function getTopic(params, callback) {
  var self = this;

  var qsValidParameters = [
    'topicUuid'
  ];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    uri: '/forums/atom/topic',
    qs: _.pick(params, qsValidParameters),
    headers: {
      accept: 'application/atom+xml'
    }
  });

  self.makeRequest(requestOptions, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    // @TODO: validate response
    // status codes: 200, 401, 404
    // header content-type: application/atom+xml

    parsers.topic(body, function (err, topic) {
      if (err) {
        return callback(err);
      }
      return callback(null, topic);
    });
  });
};

IbmConnectionsForumsService.prototype.getReply = function getReply(params, callback) {
  var self = this;

  var qsValidParameters = [
    'replyUuid'
  ];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    uri: '/forums/atom/reply',
    qs: _.pick(params, qsValidParameters),
    headers: {
      accept: 'application/atom+xml'
    }
  });

  self.makeRequest(requestOptions, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    // @TODO: validate response
    // status codes: 200, 401, 404
    // header content-type: application/atom+xml

    parsers.reply(body, function (err, reply) {
      if (err) {
        return callback(err);
      }
      return callback(null, reply);
    });
  });
};

module.exports = IbmConnectionsForumsService;

