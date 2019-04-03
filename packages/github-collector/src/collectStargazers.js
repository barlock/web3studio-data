const { from } = require('rxjs');
const { mergeMap, mergeAll, map } = require('rxjs/operators');
const repositoryStargazers = require('./queries/repositoryStargazers');

module.exports = function collectStargazers(repos) {
  return repos.pipe(
    mergeMap(repo =>
      from(repositoryStargazers({ name: repo.name, owner: repo.owner })).pipe(
        mergeAll(),
        map(stargazer => {
          return {
            event: 'stargazer',
            timestamp: stargazer.starredAt,
            meta: {
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
