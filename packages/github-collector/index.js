const winston = require('winston');
const collector = require('./src/collector');
const ElasticTransport = require('elastic-transport');

const elasticTransport = new ElasticTransport({
  transports: [new winston.transports.Console()]
});

collector(elasticTransport, {
  organizations: [
    { login: 'consensys', teams: ['web3studio'] },
    { login: 'trufflesuite' },
    { login: 'infura' }
  ],
  projectTopicFilters: ['web3studio-']
}).subscribe({
  error: console.log // eslint-disable-line no-console
});
