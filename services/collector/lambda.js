const AWS = require('aws-sdk');
const winston = require('winston');
const collector = require('github-collector');
const ElasticTransport = require('elastic-transport');

module.exports.handler = () => {
  const elasticTransport = new ElasticTransport({
    clientOpts: {
      host: `https://${process.env.ELASTIC_ENDPOINT}`,
      connectionClass: require('http-aws-es'),
      awsConfig: new AWS.Config({ region: process.env.AWS_REGION })
    },
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
};
