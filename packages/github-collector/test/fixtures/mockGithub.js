const fetchMock = require('node-fetch').default;

/**
 * Matches a fetch-mock response to a specific graphql query
 *
 * @param {string} query - Graphql query name
 * @returns {boolean} - true IFF request matches a query
 */
const matchQuery = query => (url, opts) => {
  const body = JSON.parse(opts.body);

  return body.query
    .replace(/\n/g, '')
    .trim()
    .startsWith('query ' + query);
};

module.exports = {
  beforeAll: () => {
    [
      'organizationMembers',
      'organizationRepositories',
      'organizationTeamMembers',
      'repositoryForks',
      'repositoryStargazers'
    ].forEach(query => {
      fetchMock.post(matchQuery(query), require(`./${query}`));
    });
  },
  afterAll: () => {
    fetchMock.reset();
  },
  matchQuery
};
