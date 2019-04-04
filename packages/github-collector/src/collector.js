const { merge } = require('rxjs');
const { publish, finalize } = require('rxjs/operators');
const winston = require('winston');
const elasticTransport = require('./elasticTransport');
const collectRepos = require('./collectRepos');
const collectStargazers = require('./collectStargazers');
const collectForks = require('./collectForks');
const annotateUsers = require('./annotateUsers');

module.exports = async function collect() {
  const logger = winston.createLogger({
    transports: [elasticTransport(), new winston.transports.Console()]
  });

  collectRepos()
    .pipe(
      publish(repos => merge(collectStargazers(repos), collectForks(repos))),
      annotateUsers(),
      finalize(() => {
        logger.end();
      })
    )
    .subscribe(({ event, timestamp, ...meta }) => {
      logger.info({ message: event, timestamp: timestamp, ...meta });
    });
};
