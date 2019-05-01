const { merge } = require('rxjs');
const { concatMap, map, publish } = require('rxjs/operators');
const { queryIssues } = require('../queries/repositoryIssues');
const collectIssueTimeline = require('./collectIssueTimeline');
const collectIssueReactions = require('./collectIssueReactions');
const { fromQuery } = require('../util');

module.exports = transport => repos$ => {
  return repos$.pipe(
    concatMap(repo =>
      fromQuery(
        queryIssues({
          name: repo.name,
          owner: repo.owner
        })
      ).pipe(
        map(issue => issue.node),
        publish(issue =>
          merge(
            issue.pipe(collectIssueTimeline(repo, transport)),
            issue.pipe(collectIssueReactions(repo, transport))
          )
        )
      )
    )
  );
};
