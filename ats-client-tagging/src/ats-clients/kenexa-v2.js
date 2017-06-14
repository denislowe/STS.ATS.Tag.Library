'use strict';

var util = require('util'),
  BaseAts = require('./base-ats');

function KenexaV2(collectorUrl, collectorDefaultQueryParams, params) {
  BaseAts.call(this, collectorUrl, collectorDefaultQueryParams, params);
}

util.inherits(KenexaV2, BaseAts);

KenexaV2.prototype.getReqId = function() {
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

  match = window.location.href.match(/jobid=(\w+)/i) || window.location.href.match(/AReq=(\w+)/i);
  if (match) {
    return match[1];
  }
};

module.exports = KenexaV2;
