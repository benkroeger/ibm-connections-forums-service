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
    description: xmlSelect('atom:content[@type="text"]/text()', entry).toString(),
    numberOfTopics: parseInt(xmlSelect('atom:link[@rel="replies"]/@thr:count', entry, true).value, 10),
    tags: Array.prototype.map.call(xmlSelect('atom:category[@term and not(@scheme)]/@term', entry), function (tagAttribute) {
      return tagAttribute.value;
    })
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

  var contributor = xmlSelect('atom:contributor', entry, true);
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

  var communityId = xmlSelect('snx:communityUuid/text()', entry).toString();
  if (communityId) {
    result.communityId = communityId;
  }

  var moderation = xmlSelect('snx:moderation', entry, true);
  if (moderation) {
    result.moderation = {
      status: moderation.getAttribute('status')
    };
  }

  // intentionally leaving out the "in-reply-to" information
  // looks to me like this is the same for all forums (since they are top level)
  // only variation identified is for forums within a community... they have a "catetoryUuid" attached
  // to ref and href. Resolving feed is the same as without this categoryUuid

  // var inReplyTo = xmlSelect('thr:in-reply-to', entry, true);
  // if (inReplyTo) {
  //   result.parent = {
  //     type: inReplyTo.getAttribute('type'),
  //     ref: inReplyTo.getAttribute('ref'),
  //     href: inReplyTo.getAttribute('href')
  //   };
  // }

  return result;
};

