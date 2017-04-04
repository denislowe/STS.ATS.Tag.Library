'use strict';

var util = require('util'),
  BaseAts = require('./base-ats');

function Kenexa(collectorUrl, collectorDefaultQueryParams, params) {
  BaseAts.call(this, collectorUrl, collectorDefaultQueryParams, params);
}

util.inherits(Kenexa, BaseAts);

Kenexa.prototype.getReqId = function() {
  var elements = window.document.getElementsByName('JobInfo'),
    jobId = null,
    jobIdNewBr = window.document.getElementById('hSMJobId');

  for (var i = 0; i < elements.length; i++) {
    var val = elements[i].value;
    if (val) {
      jobId = val.replace(/%/g, '').split('|')[0];
      break;
    }
  }

  if (jobId) {
    return jobId;
  }

  if (jobIdNewBr) {
    return jobIdNewBr.value;
  }

  if (window.sessionStorage && window.sessionStorage.getItem('jobId')) {
    return sessionStorage.getItem('jobId');
  }
};

module.exports = Kenexa;
