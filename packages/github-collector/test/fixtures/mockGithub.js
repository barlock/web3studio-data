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

let requests = [];

module.exports = {
  beforeAll: () => {
    requests = [];

    [
      'organizationMembers',
      'organizationRepositories',
      'organizationTeamMembers',
      'repositoryForks',
      'repositoryStargazers',
      'repositoryIssues',
      'repositoryIssueTimeline',
      'repositoryIssueReactions'
    ].forEach(query => {
      fetchMock.post(matchQuery(query), (uri, req) => {
        requests.push(JSON.parse(req.body));
        return require(`./${query}`)();
      });
    });
  },
  beforeEach: () => {
    requests = [];
  },
  afterAll: () => {
    fetchMock.reset();
  },
  matchQuery,
  requests: () => requests
};
