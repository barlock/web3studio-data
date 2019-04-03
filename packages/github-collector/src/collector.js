const { from, merge } = require('rxjs');
const { publish, filter, mergeAll, map } = require('rxjs/operators');
const organizationRepositories = require('./queries/organizationRepositories');
const collectStargazers = require('./collectStargazers');
const collectForks = require('./collectForks');

module.exports = async function collect() {
  from(organizationRepositories())
    .pipe(
      mergeAll(),
      filter(repo =>
        repo.node.repositoryTopics.edges.some(topic =>
          topic.node.topic.name.startsWith('web3studio-')
        )
      ),
      map(repo => {
        const [owner, name] = repo.node.nameWithOwner.split('/');

        return {
          ...repo,
          node: {
            ...repo.node,
            name,
            owner
          }
        };
      })
    )
    .pipe(
      publish(repos => merge(collectStargazers(repos), collectForks(repos)))
    )
    .subscribe(console.log); // eslint-disable-line no-console
};
