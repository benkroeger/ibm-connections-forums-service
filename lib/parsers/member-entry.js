'use strict';

var cons = require('../constants');
var xmlUtils = require('oniyi-utils-xml');
var xmlSelect = xmlUtils.selectUseNamespaces(cons.xmlNS);

module.exports = function (entry) {
  // <link> elements with rel in ['self', 'edit', 'alternate'] are ignored
  // as they are not relevant for this package as of now.
  var published = Date.parse(xmlSelect('atom:published/text()', entry).toString());
  var updated = Date.parse(xmlSelect('atom:updated/text()', entry).toString());
  var contributor = xmlSelect('atom:contributor', entry, true);

  var result = {
    id: xmlSelect('atom:id/text()', entry).toString(),
    title: xmlSelect('atom:title[@type="text"]/text()', entry).toString(),
    created: {
      timestamp: published,
      updated: updated,
      user: {
        email: xmlSelect('atom:email/text()', contributor).toString(),
        name: xmlSelect('atom:name/text()', contributor).toString(),
        userid: xmlSelect('snx:userid/text()', contributor).toString(),
        userState: xmlSelect('snx:userState/text()', contributor).toString()
      }
    },
    role: xmlSelect('snx:role/text()', entry).toString()
  };


  return result;
};

