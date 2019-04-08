const fetchMock = require('node-fetch').default;

const { toArray, take } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectForks = require('./collectForks');
const repositoryForks = require('../test/fixtures/repositoryForks');
const organizationRepositories = require('../test/fixtures/organizationRepositories');

describe('collectForks', () => {
  let source;

  afterAll(() => {
    fetchMock.reset();
  });

  beforeEach(() => {
    fetchMock.once('*', () => organizationRepositories());
    fetchMock.post('*', () => repositoryForks());

    source = collectRepos().pipe(take(1));
  });

  it('Collects repo forks and passes as events', async () => {
    const results = await source
      .pipe(
        collectForks,
        toArray()
      )
      .toPromise();

    expect(results.length).toEqual(7);

    expect(results).toMatchSnapshot();
  });
});
