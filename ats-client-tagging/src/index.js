'use strict';

var pkg = require('../package.json');

var queryString = require('query-string'),
  config = require('../config.json'),
  params = queryString.parse(window.document.getElementById('stcTag').src.replace(/^[^\?]+\??/,''));

var ats = params && params.ats;

if (!ats) {
  console.warn('Cannot find ats name: ' + ats);
  return;
}

if (!window.stcAtsTag) {
  window.stcAtsTag = {
    version: pkg.version
  };
}

window.onload = function() {
  var AtsClient = require('./ats-clients')(ats);
  var atsClient = new AtsClient(config.collectorUrl, config.collectorDefaultQueryParams, params);
  atsClient.sendRequest();
};
