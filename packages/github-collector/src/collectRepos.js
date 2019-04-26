const { filter, map } = require('rxjs/operators');
const organizationRepositories = require('./queries/organizationRepositories');
const { fromQuery } = require('./util');

module.exports = function collectRepos() {
  return fromQuery(organizationRepositories()).pipe(
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
