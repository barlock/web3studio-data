const fetchMock = require('node-fetch').default;

const { toArray, take } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectStargazers = require('./collectStargazers');
const repositoryStargazers = require('../test/fixtures/repositoryStargazers');
const organizationRepositories = require('../test/fixtures/organizationRepositories');

describe('collectStargazers', () => {
  let source;

  afterAll(() => {
    fetchMock.reset();
  });

  beforeEach(() => {
    fetchMock.once('*', () => organizationRepositories());
    fetchMock.post('*', () => repositoryStargazers());

    source = collectRepos().pipe(take(1));
  });

  it('Collects repo stargazers and passes as events', async () => {
    const results = await source
      .pipe(
        collectStargazers,
        toArray()
      )
      .toPromise();

    expect(results.length).toEqual(20);

    expect(results).toMatchSnapshot();
  });
});
