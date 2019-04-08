const fetchMock = require('node-fetch').default;

const mockGithub = require('../../test/fixtures/mockGithub');
const repositoryForks = require('./repositoryForks');
const repositoryForksFixture = require('../../test/fixtures/repositoryForks');

describe('The github Client', () => {
  afterEach(() => {
    mockGithub.afterAll();
  });

  it('Pages through query results', async () => {
    const firstResult = repositoryForksFixture();
    const secondResult = repositoryForksFixture();

    fetchMock.post((url, opts) => {
      const body = JSON.parse(opts.body);

      return !!body.variables.cursor;
    }, secondResult);

    firstResult.data.repository.forks.pageInfo.hasNextPage = true;
    fetchMock.post(mockGithub.matchQuery('repositoryForks'), firstResult);

    const results = await repositoryForks();

    expect(results.length).toEqual(
      firstResult.data.repository.forks.edges.length +
        secondResult.data.repository.forks.edges.length
    );
  });

  it('Allows a starting cursor to be passed', async () => {
    const firstCursor = 'firstCursor';
    const firstResult = repositoryForksFixture();
    const secondResult = repositoryForksFixture();

    firstResult.data.repository.forks.pageInfo.hasNextPage = true;

    fetchMock.post((url, opts) => {
      const body = JSON.parse(opts.body);

      return body.variables.cursor === firstCursor;
    }, firstResult);

    fetchMock.post((url, opts) => {
      const body = JSON.parse(opts.body);

      return body.variables.cursor !== firstCursor;
    }, secondResult);

    const results = await repositoryForks({ cursor: firstCursor });

    expect(results.length).toEqual(
      firstResult.data.repository.forks.edges.length +
        secondResult.data.repository.forks.edges.length
    );
  });
});
