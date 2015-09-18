'use strict';

// native node modules
var util = require('util');

// 3rd party modules
var _ = require('lodash');
var OniyiHttpClient = require('oniyi-http-client');
var xmlUtils = require('oniyi-utils-xml');

var cons = require('./constants');

var xmlSelect = xmlUtils.selectUseNamespaces(cons.xmlNS);

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
    var xmlDoc = xmlUtils.parse(body);

    var forum = {
      id: xmlSelect('/atom:entry/atom:id/text()', xmlDoc).toString(),
      title: xmlSelect('/atom:entry/atom:title[@type="text"]/text()', xmlDoc).toString(),
      published: xmlSelect('/atom:entry/atom:published/text()', xmlDoc).toString(),
      updated: xmlSelect('/atom:entry/atom:updated/text()', xmlDoc).toString(),
      author: {
        email: xmlSelect('/atom:entry/atom:author/atom:email/text()').toString(),
        name: xmlSelect('/atom:entry/atom:author/atom:name/text()').toString(),
        userid: xmlSelect('/atom:entry/atom:author/snx:userid/text()').toString(),
        userState: xmlSelect('/atom:entry/atom:author/snx:userState/text()').toString()
      },
      contributor: {
        email: xmlSelect('/atom:entry/atom:contributor/atom:email/text()').toString(),
        name: xmlSelect('/atom:entry/atom:contributor/atom:name/text()').toString(),
        userid: xmlSelect('/atom:entry/atom:contributor/snx:userid/text()').toString(),
        userState: xmlSelect('/atom:entry/atom:contributor/snx:userState/text()').toString()
      },
      links: {},
      inReplyTo: {
        href: xmlSelect('/atom:entry/thr:in-reply-to/@href').toString(),
        ref: xmlSelect('/atom:entry/thr:in-reply-to/@ref').toString(),
        type: xmlSelect('/atom:entry/thr:in-reply-to/@type').toString()
      },
      content: xmlSelect('atom:entry/atom:content[@type="html"]').toString()
    };

    // @TODO: categories, different link types
    Array.prototype.forEach.call(xmlSelect('/atom:entry/atom:linl'), function (link) {
      forum.links[link.getAttribute('rel')] = {
        href: link.getAttribute('href'),
        type: link.getAttribute('type')
      };

      // service, replies, alternate

    });

  });
};

module.exports = IbmConnectionsForumsService;

