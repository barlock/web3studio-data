const winston = require('winston');
const collector = require('./src/collector');
const ElasticTransport = require('./src/ElasticTransport');

const elasticTransport = new ElasticTransport({
  transports: [new winston.transports.Console()]
});

collector(elasticTransport).subscribe({
  error: console.log // eslint-disable-line no-console
});
