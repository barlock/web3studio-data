const { from } = require('rxjs');
const { filter, mergeAll, map } = require('rxjs/operators');
const organizationRepositories = require('./queries/organizationRepositories');

module.exports = function collectRepos() {
  return from(organizationRepositories()).pipe(
    mergeAll(),
    map(repo => {
      const { repositoryTopics, ...nodeProps } = repo.node;
      const [owner, name] = repo.node.nameWithOwner.split('/');
      const topics = repositoryTopics.edges.map(({ node }) => node.topic.name);
      const projects = topics.filter(topic => topic.startsWith('web3studio-'));

      return {
        ...nodeProps,
        projects,
        owner,
        name
      };
    }),
    filter(repo => repo.projects.length > 0)
  );
};
