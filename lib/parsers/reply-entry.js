'use strict';

var cons = require('../constants');
var xmlUtils = require('oniyi-utils-xml');
var xmlSelect = xmlUtils.selectUseNamespaces(cons.xmlNS);

module.exports = function (entry) {
  // <link> elements with rel in ['self', 'edit', 'alternate'] are ignored
  // as they are not relevant for this package as of now.
  var result = {
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

  return result;
};

