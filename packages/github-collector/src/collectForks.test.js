const { toArray, take } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectForks = require('./collectForks');
const mockGithub = require('../test/fixtures/mockGithub');

describe('collectForks', () => {
  let source;

  afterAll(mockGithub.afterAll);
  beforeAll(mockGithub.beforeAll);

  beforeEach(() => {
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
