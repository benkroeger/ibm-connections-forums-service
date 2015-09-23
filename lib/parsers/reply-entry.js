'use strict';

var _ = require('lodash');

var cons = require('../constants');
var xmlUtils = require('oniyi-utils-xml');
var xmlSelect = xmlUtils.selectUseNamespaces(cons.xmlNS);

module.exports = function (entry) {
  // <link> elements with rel in ['self', 'edit', 'alternate'] are ignored
  // as they are not relevant for this package as of now.
  var published = Date.parse(xmlSelect('atom:published/text()', entry).toString());
  var modified = Date.parse(xmlSelect('snx:contentModifiedWhen/text()', entry).toString());
  var updated = Date.parse(xmlSelect('atom:updated/text()', entry).toString());

  var result = {
    id: xmlSelect('atom:id/text()', entry).toString(),
    title: xmlSelect('atom:title[@type="text"]/text()', entry).toString(),
    created: {
      timestamp: published,
      actor: {
        email: xmlSelect('atom:author/atom:email/text()', entry).toString(),
        name: xmlSelect('atom:author/atom:name/text()', entry).toString(),
        userid: xmlSelect('atom:author/snx:userid/text()', entry).toString(),
        userState: xmlSelect('atom:author/snx:userState/text()', entry).toString()
      }
    },
    content: xmlSelect('atom:content[@type="html"]/text()', entry).toString(),
    inReplyTo: {
      href: xmlSelect('thr:in-reply-to/@href', entry, true).value,
      ref: xmlSelect('thr:in-reply-to/@ref', entry, true).value,
      type: xmlSelect('thr:in-reply-to/@type', entry, true).value
    },
    numberOfReplies: parseInt(xmlSelect('atom:link[@rel="replies"]/@thr:count', entry, true).value, 10),
    tags: Array.prototype.map.call(xmlSelect('atom:category[@term and not(@scheme)]/@term', entry), function (tagAttribute) {
      return tagAttribute.value;
    }),
    likes: parseInt(xmlSelect('atom:link[@rel="recommendations"]/@snx:recommendation', entry, true).value, 10),
    flags: {
      // <category term="NotRecommendedByCurrentUser" scheme="http://www.ibm.com/xmlns/prod/sn/flags">
      deleted: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="deleted"])', entry),
      acceptedAnswer: xmlSelect('boolean(atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term="answer"])', entry)
    }
  };

  var contentModifiedBy = xmlSelect('snx:contentModifiedBy', entry, true);
  if (!!contentModifiedBy && !_.isNaN(modified)) {
    result.modified = {
      timestamp: modified,
      actor: {
        email: xmlSelect('atom:email/text()', contentModifiedBy).toString(),
        name: xmlSelect('atom:name/text()', contentModifiedBy).toString(),
        userid: xmlSelect('snx:userid/text()', contentModifiedBy).toString(),
        userState: xmlSelect('snx:userState/text()', contentModifiedBy).toString()
      }
    };
  }

  var contributor = xmlSelect('atom:contributor', entry, true) || xmlSelect('atom:author', entry, true);
  if (published !== updated && !!contributor) {
    result.latestPost = {
      timestamp: updated,
      actor: {
        email: xmlSelect('atom:email/text()', contributor).toString(),
        name: xmlSelect('atom:name/text()', contributor).toString(),
        userid: xmlSelect('snx:userid/text()', contributor).toString(),
        userState: xmlSelect('snx:userState/text()', contributor).toString()
      }
    };
  }

  return result;
};

