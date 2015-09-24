'use strict';

module.exports = function (jsonDoc) {

  var result = '<?xml version="1.0" encoding="UTF-8"?>\
        <entry\
    xmlns="http://www.w3.org/2005/Atom"\
    xmlns:app="http://www.w3.org/2007/app"\
    xmlns:snx="http://www.ibm.com/xmlns/prod/sn"\
    xmlns:thr="http://purl.org/syndication/thread/1.0">\
        <title type="text">'+jsonDoc.title+'</title>';
  result += '<category term="forum-topic" scheme="http://www.ibm.com/xmlns/prod/sn/type"></category>';
  jsonDoc.tags.forEach(function(tag){
    result += '<category term="'+tag+'"></category>';
  });
  if(jsonDoc.flags.question){
    result += '<category term="question" scheme="http://www.ibm.com/xmlns/prod/sn/flags"></category>';
  }
  result += '<content type="text">'+jsonDoc.content+'</content></entry>';

  return result;
};
