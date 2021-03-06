'use strict';

// Browserify does not allow to dynamically load modules,
// so we need to re-initialize all of them when the script is loaded
var atsClients = {
  'healthcare': require('./healthcare'),
  'kenexa': require('./kenexa'),
  'kenexa2': require('./kenexa-v2'),
  'pageup': require('./pageup'),
  'peoplesoft': require('./peoplesoft')
};

module.exports = function(clientName) {
  return atsClients[clientName];
};
