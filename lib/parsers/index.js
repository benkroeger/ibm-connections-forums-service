'use strict';

var _ = require('lodash');

var cons = require('../constants');
var xmlUtils = require('oniyi-utils-xml');
var xmlSelect = xmlUtils.selectUseNamespaces(cons.xmlNS);

var forumEntry = require('./forum-entry');
var topicEntry = require('./topic-entry');

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

    var forums = Array.prototype.map.call(entries, forumEntry);

    callback(null, forums);
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
    // <link> elements with rel in ['self', 'edit', 'alternate'] are ignored
    // as they are not relevant for this package as of now.
    if (_.isString(xmlDoc)) {
      xmlDoc = xmlUtils.parse(xmlDoc);
    }

    var entries = xmlSelect('/atom:entry[atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-topic"]]', xmlDoc);
    // when there are no topic entries in the provided xml, return an empty array
    if (entries.length === 0) {
      return callback(null, []);
    }

    var topics = Array.prototype.map.call(entries, topicEntry);
    callback(null, topics);
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
  reply: function (xmlDoc, callback) {
    // <link> elements with rel in ['self', 'edit', 'alternate'] are ignored
    // as they are not relevant for this package as of now.
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

    var entry = entries[0];

    var reply = {
      id: xmlSelect('atom:id/text()', entry).toString(),
      title: xmlSelect('atom:title[@type="text"]/text()', entry).toString(),
      published: Date.parse(xmlSelect('atom:published/text()', entry).toString()),
      updated: Date.parse(xmlSelect('atom:updated/text()', entry).toString()),
      author: {
        email: xmlSelect('atom:author/atom:email/text()', entry).toString(),
        name: xmlSelect('atom:author/atom:name/text()', entry).toString(),
        userid: xmlSelect('atom:author/snx:userid/text()', entry).toString(),
        userState: xmlSelect('atom:author/snx:userState/text()', entry).toString()
      },
      contributor: {
        email: xmlSelect('atom:contributor/atom:email/text()', entry).toString(),
        name: xmlSelect('atom:contributor/atom:name/text()', entry).toString(),
        userid: xmlSelect('atom:contributor/snx:userid/text()', entry).toString(),
        userState: xmlSelect('atom:contributor/snx:userState/text()', entry).toString()
      },
      inReplyTo: {
        href: xmlSelect('thr:in-reply-to/@href', entry, true).value,
        ref: xmlSelect('thr:in-reply-to/@ref', entry, true).value,
        type: xmlSelect('thr:in-reply-to/@type', entry, true).value
      },
      content: xmlSelect('atom:content[@type="html"]', entry).toString(),
      flags: {
        deleted: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="deleted"])', entry),
        answer: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="answer"])', entry)
      }
    };

    callback(null, reply);
  }
};

