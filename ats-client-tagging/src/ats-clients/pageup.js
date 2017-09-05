'use strict';

var util = require('util'),
  BaseAts = require('./base-ats');

function PageUp(collectorUrl, collectorDefaultQueryParams, params) {
  BaseAts.call(this, collectorUrl, collectorDefaultQueryParams, params);
}

util.inherits(PageUp, BaseAts);

PageUp.prototype.getReqId = function() {
  var match = window.location.href.toLowerCase().match(/ljobid=(\w+)/i);
  if (match) {
    return match[1];
  }

  return '';
};

PageUp.prototype.getApplicantId = function() {
  var match = window.location.href.toLowerCase().match(/lapplicationid=(\w+)/i);
  if (match) {
    return match[1];
  }

  return '';
};

module.exports = PageUp;
