const winston = require('winston');
const collector = require('./src/collector');
const elasticTransport = require('./src/elasticTransport');

collector([
  // Transports
  elasticTransport(),
  new winston.transports.Console()
]).subscribe({
  error: console.log // eslint-disable-line no-console
});
