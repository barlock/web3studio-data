const fetchMock = require('node-fetch').default;

const mockGithub = require('../../test/fixtures/mockGithub');
const organizationRepositories = require('./organizationRepositories');
const organizationRepositoriesFixture = require('../../test/fixtures/organizationRepositories');

describe('The github Client', () => {
  afterEach(() => {
    mockGithub.afterAll();
  });

  it('Pages through query results', async () => {
    const firstResult = organizationRepositoriesFixture();

    fetchMock.post((url, opts) => {
      const body = JSON.parse(opts.body);

      return !!body.variables.cursor;
    }, organizationRepositoriesFixture());

    firstResult.data.organization.repositories.pageInfo.hasNextPage = true;
    fetchMock.post(
      mockGithub.matchQuery('organizationRepositories'),
      firstResult
    );

    const results = await organizationRepositories();

    expect(results.length).toEqual(
      firstResult.data.organization.repositories.edges.length * 2
    );
  });
});
