const { mergeMap, map } = require('rxjs/operators');
const repositoryStargazers = require('./queries/repositoryStargazers');
const { mergeLastOfType, fromQuery } = require('./util');

const event = 'stargazer';

module.exports = transport => repos$ => {
  return repos$.pipe(
    mergeLastOfType({
      event,
      transport,
      query: repo => ({ repo: repo.nameWithOwner })
    }),
    mergeMap(([repo, lastEvent]) =>
      fromQuery(
        repositoryStargazers({
          name: repo.name,
          owner: repo.owner,
          cursor: lastEvent.cursor
        })
      ).pipe(
        map(stargazer => {
          return {
            event,
            timestamp: stargazer.starredAt,
            meta: {
              cursor: stargazer.cursor,
              projects: repo.projects,
              repo: repo.nameWithOwner,
              user: stargazer.node
            }
          };
        })
      )
    )
  );
};
