const { from } = require('rxjs');
const { mergeMap, mergeAll, map } = require('rxjs/operators');
const repositoryStargazers = require('./queries/repositoryStargazers');

const event = 'stargazer';

module.exports = transport => repos => {
  return repos.pipe(
    mergeMap(repo =>
      from(transport.lastEventOfType(event, { repo: repo.nameWithOwner })).pipe(
        mergeMap(lastEvent =>
          from(
            repositoryStargazers({
              name: repo.name,
              owner: repo.owner,
              cursor: lastEvent.cursor
            })
          ).pipe(
            mergeAll(),
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
      )
    )
  );
};
