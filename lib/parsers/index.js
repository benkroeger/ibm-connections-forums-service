'use strict';

var _ = require('lodash');

var cons = require('../constants');
var xmlUtils = require('oniyi-utils-xml');
var xmlSelect = xmlUtils.selectUseNamespaces(cons.xmlNS);

module.exports = {
  forum: function (xmlDoc, callback) {

    // <link> elements with rel in ['self', 'edit', 'alternate'] are ignored
    // as they are not relevant for this package as of now.
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

    var entry = entries[0];

    var forum = {
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
      inReplyTo: {
        href: xmlSelect('thr:in-reply-to/@href', entry, true).value,
        ref: xmlSelect('thr:in-reply-to/@ref', entry, true).value,
        type: xmlSelect('thr:in-reply-to/@type', entry, true).value
      },
      content: xmlSelect('atom:content[@type="text"]/text()', entry).toString(),
      numberOfTopics: parseInt(xmlSelect('atom:link[@rel="replies"]/@thr:count', entry, true).value, 10),
      tags: Array.prototype.map.call(xmlSelect('atom:category[@term and not(@scheme)]/@term', entry), function (tagAttribute) {
        return tagAttribute.value;
      })
    };

    callback(null, forum);
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

    var entry = entries[0];

    var topic = {
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
      numberOfReplies: parseInt(xmlSelect('link[@rel="replies"]/@thr:count', entry, true).value, 10),
      tags: Array.prototype.map.call(xmlSelect('category[@term and not(@scheme)]/@term', entry), function (tagAttribute) {
        return tagAttribute.value;
      }),
      flags: {
        pinned: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="pinned"])', entry),
        locked: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="locked"])', entry),
        question: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="question"])', entry),
        answered: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="answered"])', entry),
        likedByCurrentUser: !xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="NotRecommendedByCurrentUser"])', entry)
      },
      likes: {
        thread: parseInt(xmlSelect('atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="ThreadRecommendationCount"]/@label', entry, true), 10)
      }
    };

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

