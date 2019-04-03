const { from } = require('rxjs');
const { mergeMap, mergeAll, map } = require('rxjs/operators');
const repositoryStargazers = require('./queries/repositoryStargazers');

module.exports = function collectStargazers(repos) {
  return repos.pipe(
    mergeMap(({ node }) =>
      from(repositoryStargazers({ name: node.name, owner: node.owner }))
    ),
    mergeAll(),
    map(stargazer => ({
      event: 'stargazer',
      timestamp: stargazer.starredAt,
      user: stargazer.node
    }))
  );
};
