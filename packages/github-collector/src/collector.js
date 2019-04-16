const { merge } = require('rxjs');
const { publish, tap, finalize } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectStargazers = require('./collectStargazers');
const collectForks = require('./collectForks');
const annotateUsers = require('./annotateUsers');

module.exports = function collect(transport) {
  return collectRepos().pipe(
    publish(repos =>
      merge(
        repos.pipe(collectStargazers(transport)),
        repos.pipe(collectForks(transport))
      )
    ),
    annotateUsers(),
    tap(({ event, timestamp, ...meta }) => {
      transport.logger.info({ message: event, timestamp: timestamp, ...meta });
    }),
    finalize(() => {
      transport.logger.end();
    })
  );
};
