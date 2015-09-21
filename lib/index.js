'use strict';

// native node modules
var util = require('util');

// 3rd party modules
var _ = require('lodash');
var OniyiHttpClient = require('oniyi-http-client');

// internal modules
var HTTPError = require('./HTTPError');
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


IbmConnectionsForumsService.prototype.getForums = function getForums(params, callback) {
  var self = this;

  var qsValidParameters = [
    'communityUuid',
    'email',
    'page',
    'ps',
    'since',
    'sortBy',
    'sortOrder',
    'tag',
    'userid'
  ];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    uri: '/forums/atom/forums',
    qs: _.pick(params, qsValidParameters),
    headers: {
      accept: 'application/atom+xml'
    }
  });

  self.makeRequest(requestOptions, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    if (!response) {
      return callback(new HTTPError(500));
    }
    if ([200, 401, 404].indexOf(response.statusCode) < 0) {
      return callback(new HTTPError(500, 'Invalid Response status from Backend'));
    }
    if (response.statusCode !== 200) {
      return callback(new HTTPError(response.statusCode));
    }
    if (!(response.headers && /application\/atom\+xml/i.test(response.headers['content-type']))) {
      return callback(new HTTPError(500, 'Invalid Response content-type from Backend'));
    }

    parsers.forums(body, function (err, forums) {
      if (err) {
        return callback(err);
      }
      return callback(null, forums);
    });
  });
};

IbmConnectionsForumsService.prototype.getTopics = function getForums(params, callback) {
  var self = this;

  var qsValidParameters = [
    'forumUuid',
    'communityUuid',
    'email',
    'page',
    'ps',
    'since',
    'sortBy', // created, modified
    'sortOrder', // asc, desc
    'tag',
    'userid',
    'filter', // answeredquestions, questions, allquestions, topics
    'within' // standalone, communities
  ];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    uri: '/forums/atom/topics',
    qs: _.pick(params, qsValidParameters),
    headers: {
      accept: 'application/atom+xml'
    }
  });

  self.makeRequest(requestOptions, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    if (!response) {
      return callback(new HTTPError(500));
    }
    if ([200, 401, 404].indexOf(response.statusCode) < 0) {
      return callback(new HTTPError(500, 'Invalid Response status from Backend'));
    }
    if (response.statusCode !== 200) {
      return callback(new HTTPError(response.statusCode));
    }
    if (!(response.headers && /application\/atom\+xml/i.test(response.headers['content-type']))) {
      return callback(new HTTPError(500, 'Invalid Response content-type from Backend'));
    }

    parsers.topics(body, function (err, result) {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  });
};

IbmConnectionsForumsService.prototype.getReplies = function getReplies(params, callback) {
  var self = this;

  var qsValidParameters = [
    'topicUuid',
    'email',
    'page',
    'ps',
    'since',
    'sortBy', // created, modified
    'sortOrder', // asc, desc
    'tag',
    'userid'
  ];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    uri: '/forums/atom/replies',
    qs: _.pick(params, qsValidParameters),
    headers: {
      accept: 'application/atom+xml'
    }
  });

  self.makeRequest(requestOptions, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    if (!response) {
      return callback(new HTTPError(500));
    }
    if ([200, 401, 404].indexOf(response.statusCode) < 0) {
      return callback(new HTTPError(500, 'Invalid Response status from Backend'));
    }
    if (response.statusCode !== 200) {
      return callback(new HTTPError(response.statusCode));
    }
    if (!(response.headers && /application\/atom\+xml/i.test(response.headers['content-type']))) {
      return callback(new HTTPError(500, 'Invalid Response content-type from Backend'));
    }

    parsers.replies(body, function (err, result) {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  });
};

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
    if (!response) {
      return callback(new HTTPError(500));
    }
    if ([200, 401, 404].indexOf(response.statusCode) < 0) {
      return callback(new HTTPError(500, 'Invalid Response status from Backend'));
    }
    if (response.statusCode !== 200) {
      return callback(new HTTPError(response.statusCode));
    }
    if (!(response.headers && /application\/atom\+xml/i.test(response.headers['content-type']))) {
      return callback(new HTTPError(500, 'Invalid Response content-type from Backend'));
    }

    parsers.forum(body, function (err, forum) {
      if (err) {
        return callback(err);
      }
      return callback(null, forum);
    });
  });
};

IbmConnectionsForumsService.prototype.updateForum = function updateForum(params, callback) {
  var self = this;

  var qsValidParameters = [];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    method: 'PUT',
    uri: '/forums/atom/forum',
    qs: _.merge(_.pick(params, qsValidParameters), {
      forumUuid: params.forumId
    }),
    headers: {
      'content-type': 'application/atom+xml'
    }
  });

  // @TODO: parse provided updates into xml forum entry and append to request

  self.makeRequest(requestOptions, function (err, response, body) {
    if (err) {
      return callback(err);
    }
    if (!response) {
      return callback(new HTTPError(500));
    }
    if (response.statusCode !== 200) {
      return callback(new HTTPError(response.statusCode));
    }

    // @TODO: retrieve the updated forum entry and return that
    callback(null);
  });
};

IbmConnectionsForumsService.prototype.deleteForum = function deleteForum(params, callback) {
  var self = this;

  var qsValidParameters = [];

  var requestOptions = _.merge(self.extractRequestParams(params), {
    method: 'DELETE',
    uri: '/forums/atom/forum',
    qs: _.merge(_.pick(params, qsValidParameters), {
      forumUuid: params.forumId
    })
  });

  self.makeRequest(requestOptions, function (err, response) {
    if (err) {
      return callback(err);
    }
    if (!response) {
      return callback(new HTTPError(500));
    }
    if ([204, 401, 404].indexOf(response.statusCode) < 0) {
      return callback(new HTTPError(500, 'Invalid Response status from Backend'));
    }
    if (response.statusCode !== 204) {
      return callback(new HTTPError(response.statusCode));
    }
    callback(null);
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
    if (!response) {
      return callback(new HTTPError(500));
    }
    if ([200, 401, 404].indexOf(response.statusCode) < 0) {
      return callback(new HTTPError(500, 'Invalid Response status from Backend'));
    }
    if (response.statusCode !== 200) {
      return callback(new HTTPError(response.statusCode));
    }
    if (!(response.headers && /application\/atom\+xml/i.test(response.headers['content-type']))) {
      return callback(new HTTPError(500, 'Invalid Response content-type from Backend'));
    }

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
    if (!response) {
      return callback(new HTTPError(500));
    }
    if ([200, 401, 404].indexOf(response.statusCode) < 0) {
      return callback(new HTTPError(500, 'Invalid Response status from Backend'));
    }
    if (response.statusCode !== 200) {
      return callback(new HTTPError(response.statusCode));
    }
    if (!(response.headers && /application\/atom\+xml/i.test(response.headers['content-type']))) {
      return callback(new HTTPError(500, 'Invalid Response content-type from Backend'));
    }

    parsers.reply(body, function (err, reply) {
      if (err) {
        return callback(err);
      }
      return callback(null, reply);
    });
  });
};

module.exports = IbmConnectionsForumsService;

