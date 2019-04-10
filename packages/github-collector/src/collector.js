const { merge } = require('rxjs');
const { publish, tap, finalize } = require('rxjs/operators');
const winston = require('winston');
const collectRepos = require('./collectRepos');
const collectStargazers = require('./collectStargazers');
const collectForks = require('./collectForks');
const annotateUsers = require('./annotateUsers');

module.exports = function collect(transports) {
  const logger = winston.createLogger({
    transports
  });

  return collectRepos().pipe(
    publish(repos => merge(collectStargazers(repos), collectForks(repos))),
    annotateUsers(),
    tap(({ event, timestamp, ...meta }) => {
      logger.info({ message: event, timestamp: timestamp, ...meta });
    }),
    finalize(() => {
      logger.end();
    })
  );
};
