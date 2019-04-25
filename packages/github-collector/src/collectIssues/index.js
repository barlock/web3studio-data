const { from, merge } = require('rxjs');
const { concatMap, mergeAll, map, publish } = require('rxjs/operators');
const { queryIssues } = require('../queries/repositoryIssues');
const collectIssueTimeline = require('./collectIssueTimeline');

module.exports = transport => repos => {
  return repos.pipe(
    concatMap(repo =>
      from(
        queryIssues({
          name: repo.name,
          owner: repo.owner
        })
      ).pipe(
        mergeAll(),
        map(issue => issue.node),
        publish(issue =>
          merge(
            issue.pipe(collectIssueTimeline(repo, transport))
            // issues.pipe(collectIssueReactions(repo, transport))
          )
        )
      )
    )
  );
};
