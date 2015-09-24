'use strict';

module.exports = function (jsonDoc, forumUuid) {

  var result = '<?xml version="1.0" encoding="UTF-8"?>\
        <entry\
    xmlns="http://www.w3.org/2005/Atom"\
    xmlns:app="http://www.w3.org/2007/app"\
    xmlns:snx="http://www.ibm.com/xmlns/prod/sn"\
    xmlns:thr="http://purl.org/syndication/thread/1.0">\
        <id>'+jsonDoc.id+'</id>\
        <title type="text">'+jsonDoc.title+'</title>';
  if(jsonDoc.moderation != undefined) {
    result += '<snx:moderation xmlns:snx="http://www.ibm.com/xmlns/prod/sn"\
                    status="'+jsonDoc.moderation.status+'"></snx:moderation>';
  }
  result += '<published>'+timeConverter(jsonDoc.created.timestamp)+'</published>\
    <author>\
        <email>'+jsonDoc.created.actor.email+'</email>\
        <name>'+jsonDoc.created.actor.name+'</name>\
        \
        <snx:userid\
             xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+jsonDoc.created.actor.userid+'\
        </snx:userid>\
        <snx:userState\
            xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+jsonDoc.created.actor.userState+'\
        </snx:userState>\
    </author>';
  if(jsonDoc.latestPost) {
    result += '<updated>'+timeConverter(jsonDoc.latestPost.timestamp)+'</updated>\
        <contributor>\
        <email>'+jsonDoc.latestPost.actor.email+'</email>\
        <name>'+jsonDoc.latestPost.actor.name+'</name>\
        <snx:userid\
        xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+jsonDoc.latestPost.actor.userid+'\
        </snx:userid>\
        <snx:userState\
        xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+jsonDoc.latestPost.actor.userState+'\
            </snx:userState>\
        </contributor>';
  } else {
    result += '<updated>'+timeConverter(jsonDoc.created.timestamp)+'</updated>';
  }
  if(jsonDoc.modified){
    result +='<snx:contentModifiedWhen\
        xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+timeConverter(jsonDoc.modified.timestamp)+'\
        </snx:contentModifiedWhen>\
        <snx:contentModifiedBy\
        xmlns:snx="http://www.ibm.com/xmlns/prod/sn">\
            <email>'+jsonDoc.modified.actor.email+'</email>\
        <name>'+jsonDoc.modified.actor.name+'</name>\
        <snx:userid\
        xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+jsonDoc.modified.actor.userid+'\
        </snx:userid>\
        <snx:userState\
        xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+jsonDoc.modified.actor.userState+'\
            </snx:userState>\
        </snx:contentModifiedBy>';
  }
  if(jsonDoc.communityId){
    result +='<snx:communityUuid\
        xmlns:snx="http://www.ibm.com/xmlns/prod/sn">'+jsonDoc.communityId+'\
        </snx:communityUuid>'
  }

  result += '<link href="http://profiledemo.ibm-sba.com/forums/atom/forum?forumUuid='+forumUuid+'" rel="self" type="application/atom+xml"></link>\
               <link href="http://profiledemo.ibm-sba.com/forums/atom/forum?forumUuid='+forumUuid+'" rel="edit" type="application/atom+xml"></link>';
  result += '<category term="forum-forum" scheme="http://www.ibm.com/xmlns/prod/sn/type"></category>';
  jsonDoc.tags.forEach(function(tag){
    result += ' <category term="'+tag+'"></category>';
  });
  result += '<link href="http://profiledemo.ibm-sba.com/forums/html/forum?id='+forumUuid+'" rel="alternate" type="text/html"></link>\
        <link    xmlns:thr="http://purl.org/syndication/thread/1.0" \
    href="http://profiledemo.ibm-sba.com/forums/atom/topics?forumUuid='+forumUuid+'" rel="replies" type="application/atom+xml" thr:count="'+jsonDoc.numberOfTopics+'">\
        </link>\
        <link href="http://profiledemo.ibm-sba.com/forums/atom/acl?forumUuid='+forumUuid+'" rel="http://www.ibm.com/xmlns/prod/sn/member-list" type="application/atom+xml"></link>\
        <link href="http://profiledemo.ibm-sba.com/forums/atom/service?forumUuid='+forumUuid+'" rel="service" type="application/atomsvc+xml" title="Atom Publishing Protocol"></link>';
  result += '<thr:in-reply-to	\
                xmlns:thr="http://purl.org/syndication/thread/1.0" href="http://profiledemo.ibm-sba.com/forums/atom/forums" ref="http://profiledemo.ibm-sba.com/forums/atom/forums" type="application/atom+xml">\
                </thr:in-reply-to>';
  result += '<content type="text">'+jsonDoc.description+'</content></entry>';

  return result;
};

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = a.getMonth();
  if(month < 10) month='0'+month;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var msec = a.getMilliseconds();
  var time = year + '-' + month + '-' + date + 'T' + hour + ':' + min + ':' + sec + '.' + msec +'Z';
  return time;//2015-09-22T12:01:34.406Z
}
