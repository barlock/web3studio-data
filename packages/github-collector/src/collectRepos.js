const { concat } = require('rxjs');
const { filter, map, mergeAll } = require('rxjs/operators');
const organizationRepositories = require('./queries/organizationRepositories');
const { fromQuery } = require('./util');

module.exports = function collectRepos({ organizations, projectTopicFilters }) {
  return concat(
    organizations.map(org =>
      fromQuery(organizationRepositories({ login: org.login }))
    )
  ).pipe(
    mergeAll(),
    map(repo => {
      const { repositoryTopics, ...nodeProps } = repo.node;
      const [owner, name] = repo.node.nameWithOwner.split('/');
      const topics = repositoryTopics.edges.map(({ node }) => node.topic.name);
      const projects =
        projectTopicFilters &&
        topics.filter(topic =>
          projectTopicFilters.some(filter => topic.includes(filter))
        );

      return {
        ...nodeProps,
        projects,
        owner,
        name
      };
    }),
    filter(repo => !projectTopicFilters || repo.projects.length > 0)
  );
};
