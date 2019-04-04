const { from } = require('rxjs');
const { mergeMap, mergeAll, map } = require('rxjs/operators');
const repositoryForks = require('./queries/repositoryForks');

module.exports = function collectForks(repos) {
  return repos.pipe(
    mergeMap(repo =>
      from(repositoryForks({ name: repo.name, owner: repo.owner })).pipe(
        mergeAll(),
        map(fork => ({
          event: 'fork',
          timestamp: fork.node.createdAt,
          meta: {
            projects: repo.projects,
            repo: repo.nameWithOwner,
            user: fork.node.owner
          }
        }))
      )
    )
  );
};
