const { from } = require('rxjs');
const { mergeMap, mergeAll, map } = require('rxjs/operators');
const repositoryForks = require('./queries/repositoryForks');

module.exports = function collectStargazers(repos) {
  return repos.pipe(
    mergeMap(({ node }) =>
      from(repositoryForks({ name: node.name, owner: node.owner }))
    ),
    mergeAll(),
    map(fork => ({
      event: 'fork',
      timestamp: fork.node.createdAt,
      user: fork.node.owner
    }))
  );
};
