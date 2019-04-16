const { from } = require('rxjs');
const { mergeMap, mergeAll, map } = require('rxjs/operators');
const repositoryForks = require('./queries/repositoryForks');

const event = 'fork';

module.exports = transport => repos => {
  return repos.pipe(
    mergeMap(repo =>
      from(transport.lastEventOfType(event, { repo: repo.nameWithOwner })).pipe(
        mergeMap(lastEvent =>
          from(
            repositoryForks({
              name: repo.name,
              owner: repo.owner,
              cursor: lastEvent.cursor
            })
          ).pipe(
            mergeAll(),
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
      )
    )
  );
};
