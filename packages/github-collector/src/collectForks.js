const { mergeMap, map } = require('rxjs/operators');
const repositoryForks = require('./queries/repositoryForks');
const { mergeLastOfType, fromQuery } = require('./util');

const event = 'fork';

module.exports = transport => repos$ => {
  return repos$.pipe(
    mergeLastOfType({
      event,
      transport,
      query: repo => ({ repo: repo.nameWithOwner })
    }),
    mergeMap(([repo, lastEvent]) =>
      fromQuery(
        repositoryForks({
          name: repo.name,
          owner: repo.owner,
          cursor: lastEvent.cursor
        })
      ).pipe(
        map(fork => ({
          event,
          timestamp: fork.node.createdAt,
          meta: {
            cursor: fork.cursor,
            projects: repo.projects,
            repo: repo.nameWithOwner,
            user: fork.node.owner
          }
        }))
      )
    )
  );
};
