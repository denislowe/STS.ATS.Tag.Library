'use strict';

var util = require('util'),
  BaseAts = require('./base-ats');

function PeopleSoft(collectorUrl, collectorDefaultQueryParams, params) {
  BaseAts.call(this, collectorUrl, collectorDefaultQueryParams, params);
}

util.inherits(PeopleSoft, BaseAts);

PeopleSoft.prototype.getReqId = function() {
  var element = document.getElementById('HRS_APP_RCMNT_I_HRS_JOB_OPENING_ID$0');
  var jobId = element && (element.innerText || element.textContent).trim();
  return jobId || '';
};

module.exports = PeopleSoft;
