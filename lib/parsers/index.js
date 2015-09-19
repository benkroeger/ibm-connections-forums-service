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

    var entries = xmlSelect('category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-forum"]]', xmlDoc);
    if (entries.length === 0) {
      return callback(new Error('No forum entry found in xmlDoc'));
    }
    if (entries.length > 1) {
      return callback(new Error('Found more than one forum entry in xmlDoc'));
    }

    var entry = entries[0];

    var forum = {
      id: xmlSelect('id/text()', entry).toString(),
      title: xmlSelect('title[@type="text"]/text()', entry).toString(),
      published: xmlSelect('published/text()', entry).toString(),
      updated: xmlSelect('updated/text()', entry).toString(),
      author: {
        email: xmlSelect('author/email/text()', entry).toString(),
        name: xmlSelect('author/name/text()', entry).toString(),
        userid: xmlSelect('author/snx:userid/text()', entry).toString(),
        userState: xmlSelect('author/snx:userState/text()', entry).toString()
      },
      contributor: {
        email: xmlSelect('contributor/email/text()', entry).toString(),
        name: xmlSelect('contributor/name/text()', entry).toString(),
        userid: xmlSelect('contributor/snx:userid/text()', entry).toString(),
        userState: xmlSelect('contributor/snx:userState/text()', entry).toString()
      },
      inReplyTo: {
        href: xmlSelect('thr:in-reply-to/@href', entry).value,
        ref: xmlSelect('thr:in-reply-to/@ref', entry).value,
        type: xmlSelect('thr:in-reply-to/@type', entry).value
      },
      content: xmlSelect('content[@type="html"]').toString(),
      numberOfTopics: parseInt(xmlSelect('link[@rel="replies"]/@thr:count', entry).value, 10),
      tags: Array.prototype.map.call(xmlSelect('category[@term and not(@scheme)]/@term', entry), function (tagAttribute) {
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

    var entries = xmlSelect('category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-topic"]]', xmlDoc);
    if (entries.length === 0) {
      return callback(new Error('No topic entry found in xmlDoc'));
    }
    if (entries.length > 1) {
      return callback(new Error('Found more than one topic entry in xmlDoc'));
    }

    var entry = entries[0];

    var topic = {
      id: xmlSelect('id/text()', entry).toString(),
      title: xmlSelect('title[@type="text"]/text()', entry).toString(),
      published: xmlSelect('published/text()', entry).toString(),
      updated: xmlSelect('updated/text()', entry).toString(),
      author: {
        email: xmlSelect('author/email/text()', entry).toString(),
        name: xmlSelect('author/name/text()', entry).toString(),
        userid: xmlSelect('author/snx:userid/text()', entry).toString(),
        userState: xmlSelect('author/snx:userState/text()', entry).toString()
      },
      contributor: {
        email: xmlSelect('contributor/email/text()', entry).toString(),
        name: xmlSelect('contributor/name/text()', entry).toString(),
        userid: xmlSelect('contributor/snx:userid/text()', entry).toString(),
        userState: xmlSelect('contributor/snx:userState/text()', entry).toString()
      },
      inReplyTo: {
        href: xmlSelect('thr:in-reply-to/@href', entry).value,
        ref: xmlSelect('thr:in-reply-to/@ref', entry).value,
        type: xmlSelect('thr:in-reply-to/@type', entry).value
      },
      content: xmlSelect('content[@type="html"]').toString(),
      numberOfReplies: parseInt(xmlSelect('link[@rel="replies"]/@thr:count', entry).value, 10),
      tags: Array.prototype.map.call(xmlSelect('category[@term and not(@scheme)]/@term', entry), function (tagAttribute) {
        return tagAttribute.value;
      }),
      flags: {
        pinned: xmlSelect('boolean(category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="pinned"])', entry),
        locked: xmlSelect('boolean(category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="locked"])', entry),
        question: xmlSelect('boolean(category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="question"])', entry),
        answered: xmlSelect('boolean(category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="answered"])', entry),
        likedByCurrentUser: !xmlSelect('boolean(category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="NotRecommendedByCurrentUser"])', entry)
      },
      likes: {
        thread: parseInt(xmlSelect('category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="ThreadRecommendationCount"]/@label', entry), 10)
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

    var entries = xmlSelect('category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term="forum-reply"]]', xmlDoc);
    if (entries.length === 0) {
      return callback(new Error('No reply entry found in xmlDoc'));
    }
    if (entries.length > 1) {
      return callback(new Error('Found more than one reply entry in xmlDoc'));
    }

    var entry = entries[0];

    var reply = {
      id: xmlSelect('id/text()', entry).toString(),
      title: xmlSelect('title[@type="text"]/text()', entry).toString(),
      published: xmlSelect('published/text()', entry).toString(),
      updated: xmlSelect('updated/text()', entry).toString(),
      author: {
        email: xmlSelect('author/email/text()', entry).toString(),
        name: xmlSelect('author/name/text()', entry).toString(),
        userid: xmlSelect('author/snx:userid/text()', entry).toString(),
        userState: xmlSelect('author/snx:userState/text()', entry).toString()
      },
      contributor: {
        email: xmlSelect('contributor/email/text()', entry).toString(),
        name: xmlSelect('contributor/name/text()', entry).toString(),
        userid: xmlSelect('contributor/snx:userid/text()', entry).toString(),
        userState: xmlSelect('contributor/snx:userState/text()', entry).toString()
      },
      inReplyTo: {
        href: xmlSelect('thr:in-reply-to/@href', entry).value,
        ref: xmlSelect('thr:in-reply-to/@ref', entry).value,
        type: xmlSelect('thr:in-reply-to/@type', entry).value
      },
      content: xmlSelect('content[@type="html"]').toString(),
      flags: {
        deleted: xmlSelect('boolean(category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="deleted"])', entry),
        answer: xmlSelect('boolean(category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="answer"])', entry)
      }
    };

    callback(null, reply);
  }
};

