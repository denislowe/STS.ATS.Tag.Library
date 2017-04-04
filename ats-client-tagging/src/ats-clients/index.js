'use strict';

// Browserify does not allow to dynamically load modules,
// so we need to re-initialize all of them when the script is loaded
var atsClients = {
  'kenexa': require('./kenexa')
};

module.exports = function(clientName) {
  return atsClients[clientName];
};
