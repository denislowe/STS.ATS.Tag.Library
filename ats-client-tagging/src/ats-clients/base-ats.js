'use strict';

function BaseAts(collectorUrl, collectorDefaultQueryParams, params) {
  this.collectorUrl = collectorUrl;
  this.collectorDefaultQueryParams = collectorDefaultQueryParams;
  this.params = params;
}

BaseAts.prototype.getAppId = function() {
  return this.params.aid;
};

BaseAts.prototype.getReqId = function() {
  return '';
};

BaseAts.prototype.getApplicantId = function() {
  return this.params.applicantid;
};

BaseAts.prototype.generateQueryParameters = function() {
  var result = '',
    appId = this.getAppId(),
    applicantId = this.getApplicantId(),
    reqId = this.getReqId();

  if (appId) {
    result += '&aid=' + encodeURIComponent(appId);
  }

  if (applicantId) {
    result += '&se_pr=' + encodeURIComponent(applicantId);
  }

  if (reqId) {
    result += '&se_la=' + encodeURIComponent(reqId);
  }

  // Force browser to hit the URL instead of retrieving the content from cache?
  result += '&_t=' + (+new Date());

  return result;
};

BaseAts.prototype.sendRequest = function() {
  var url = this.collectorUrl + this.collectorDefaultQueryParams,
    img = new Image();

  img.style.display = 'none';

  url += this.generateQueryParameters();
  img.src = url;

  img.onerror = function() {
    console.error('Failed to send request to ' + url);
  };
  img.onload = function() {
    console.debug('Successfully sent request to ' + url);
  };
};

module.exports = BaseAts;
