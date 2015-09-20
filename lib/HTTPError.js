'use strict';

var util = require('util');
var http = require('http');

function HTTPError(status, message) {
  // Make sure we're using the 'new' keyword
  if (!(this instanceof HTTPError)) {
    return new HTTPError(status, message);
  }

  if (typeof status !== 'number') {
    message = status;
    status = null;
  }
  if (!message) {
    message = http.STATUS_CODES[status];
  }

  Error.call(this); //super constructor
  Error.captureStackTrace(this, this.constructor);

  // Setup error details
  this.name = this.constructor.name;
  this.httpStatus = status || 500;
  this.message = message || '';
}
util.inherits(HTTPError, Error);

// Formatting for error message
HTTPError.prototype.toString = function () {
  return this.name + ': ' + this.httpStatus + ' ' + this.message;
};

module.exports = HTTPError;

