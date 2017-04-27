'use strict';

var util = require('util'),
  BaseAts = require('./base-ats');

function Kenexa(collectorUrl, collectorDefaultQueryParams, params) {
  BaseAts.call(this, collectorUrl, collectorDefaultQueryParams, params);

  if (this.getAction() === this.knownActions.appStart) {
    this._storeReqId(this._reqIdOnAppStart());
  }
}

util.inherits(Kenexa, BaseAts);

Kenexa.prototype._storeReqId = function(reqId) {
  if (!reqId) {
    return;
  }

  window.sessionStorage.setItem('stcJobId', reqId);
};

Kenexa.prototype._reqIdOnAppStart = function() {
  var buttons = document.getElementsByTagName('a'),
    match;

  if (buttons) {
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].className &&
        buttons[i].className.indexOf('job-apply') > -1 &&
        buttons[i].href &&
        /sjobs\.brassring\.com/i.test(buttons[i].href) &&
        buttons[i].href.match(/jobid=(\d+)/i)
      ) {
        return buttons[i].href.match(/jobid=(\d+)/i)[1];
      }
    }
  }

  if (window.location.href.match(/partnerid=25782/i) &&
    window.location.href.match(/siteid=5121/i) &&
    window.document.getElementById('Auto req ID')) {
    return window.document.getElementById('Auto req ID').innerHTML;
  }

  match = window.location.href.match(/jobid=(\w+)/i) || window.location.href.match(/areq=(\w+)/i);
  if (match) {
    return match[1];
  }
};

Kenexa.prototype._reqIdOnAppComplete = function() {
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

  if (window.sessionStorage && window.sessionStorage.getItem('stcJobId')) {
    return sessionStorage.getItem('stcJobId');
  }
};

Kenexa.prototype.getReqId = function() {
  switch (this.getAction()) {
    case this.knownActions.appStart:
      return this._reqIdOnAppStart();
    default:
      return this._reqIdOnAppComplete();
  }
};

module.exports = Kenexa;
