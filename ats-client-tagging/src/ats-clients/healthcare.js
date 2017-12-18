'use strict';

var util = require('util'),
  BaseAts = require('./base-ats');

function Healthcare(collectorUrl, collectorDefaultQueryParams, params) {
  BaseAts.call(this, collectorUrl, collectorDefaultQueryParams, params);
}

util.inherits(Healthcare, BaseAts);

Healthcare.prototype.getReqId = function() {
  return sessionStorage.getItem('jobId') || '';
};

module.exports = Healthcare;
