'use strict';

var util = require('util'),
  BaseAts = require('./base-ats');

function PeopleSoft(collectorUrl, collectorDefaultQueryParams, params) {
  BaseAts.call(this, collectorUrl, collectorDefaultQueryParams, params);
}

util.inherits(PeopleSoft, BaseAts);

PeopleSoft.prototype.getReqId = function() {
  var spans = document.getElementsByTagName('span');

  for (var i = 0; i < spans.length; i++) {
    if (spans[i].className !== 'pagesubheading') {
      continue;
    }

    var match = spans[i].innerHTML.trim().match(/(\d+)$/);
    if (match) {
      return match[1];
    }
  }

  return '';
};

module.exports = PeopleSoft;
