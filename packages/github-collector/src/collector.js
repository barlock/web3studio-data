const { merge } = require('rxjs');
const { publish, tap, finalize } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectStargazers = require('./collectStargazers');
const collectForks = require('./collectForks');
const collectIssues = require('./collectIssues');
const annotateUsers = require('./annotateUsers');

module.exports = function collect(transport, ops) {
  return collectRepos(ops).pipe(
    publish(repos =>
      merge(
        repos.pipe(collectStargazers(transport)),
        repos.pipe(collectForks(transport)),
        repos.pipe(collectIssues(transport))
      )
    ),
    annotateUsers(ops),
    tap(({ event, timestamp, ...meta }) => {
      transport.logger.info({ message: event, timestamp: timestamp, ...meta });
    }),
    finalize(() => {
      transport.logger.end();
    })
  );
};
