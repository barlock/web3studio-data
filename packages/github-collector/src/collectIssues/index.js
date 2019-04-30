const { from, merge } = require('rxjs');
const { concatMap, mergeAll, map, publish } = require('rxjs/operators');
const { queryIssues } = require('../queries/repositoryIssues');
const collectIssueTimeline = require('./collectIssueTimeline');
const collectIssueReactions = require('./collectIssueReactions');

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
            issue.pipe(collectIssueTimeline(repo, transport)),
            issue.pipe(collectIssueReactions(repo, transport))
          )
        )
      )
    )
  );
};
