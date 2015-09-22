'use strict';

var _ = require('lodash');

var cons = require('../constants');
var xmlUtils = require('oniyi-utils-xml');
var xmlSelect = xmlUtils.selectUseNamespaces(cons.xmlNS);

var forumEntry = require('./forum-entry');
var topicEntry = require('./topic-entry');
var replyEntry = require('./reply-entry');
var memberEntry = require('./member-entry');

module.exports = {
  forums: function (xmlDoc, callback) {
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:feed/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-forum"]]', xmlDoc);
    // when there are no forum entries in the provided xml, return an empty array
    if (entries.length === 0) {
      return callback(null, []);
    }

    var result = Array.prototype.map.call(entries, forumEntry);

    callback(null, result);
  },
  forum: function (xmlDoc, callback) {
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-forum"]]', xmlDoc);
    if (entries.length === 0) {
      return callback(new Error('No forum entry found in xmlDoc'));
    }
    if (entries.length > 1) {
      return callback(new Error('Found more than one forum entry in xmlDoc'));
    }

    var forum = forumEntry(entries[0]);

    callback(null, forum);
  },
  topics: function (xmlDoc, callback) {
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:feed/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-topic"]]', xmlDoc);
    // when there are no topic entries in the provided xml, return an empty array
    if (entries.length === 0) {
      return callback(null, []);
    }

    var result = Array.prototype.map.call(entries, topicEntry);
    callback(null, result);
  },
  topic: function (xmlDoc, callback) {
    // <link> elements with rel in ['self', 'edit', 'alternate'] are ignored
    // as they are not relevant for this package as of now.
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-topic"]]', xmlDoc);
    if (entries.length === 0) {
      return callback(new Error('No topic entry found in xmlDoc'));
    }
    if (entries.length > 1) {
      return callback(new Error('Found more than one topic entry in xmlDoc'));
    }

    var topic = topicEntry(entries[0]);
    callback(null, topic);
  },
  replies: function (xmlDoc, callback) {
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:feed/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-reply"]]', xmlDoc);
    // when there are no topic entries in the provided xml, return an empty array
    if (entries.length === 0) {
      return callback(null, []);
    }

    var result = Array.prototype.map.call(entries, replyEntry);
    callback(null, result);
  },
  reply: function (xmlDoc, callback) {
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-reply"]]', xmlDoc);
    if (entries.length === 0) {
      return callback(new Error('No reply entry found in xmlDoc'));
    }
    if (entries.length > 1) {
      return callback(new Error('Found more than one reply entry in xmlDoc'));
    }

    var reply = replyEntry(entries[0]);
    callback(null, reply);
  },
  members: function (xmlDoc, callback) {
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:feed/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="person"]]', xmlDoc);
    // when there are no topic entries in the provided xml, return an empty array
    if (entries.length === 0) {
      return callback(null, []);
    }

    var result = Array.prototype.map.call(entries, memberEntry);
    callback(null, result);
  },
  member: function (xmlDoc, callback) {
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entry = xmlSelect('/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="person"]]', xmlDoc)[0];
    // when there are no topic entries in the provided xml, return an empty array
    if (entry == null) {
      return callback(null, []);
    }

    var result = memberEntry(entry);
    callback(null, result);
  }

};

