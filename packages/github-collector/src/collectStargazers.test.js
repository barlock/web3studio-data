const { toArray, take } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectStargazers = require('./collectStargazers');
const mockGithub = require('../test/fixtures/mockGithub');

describe('collectStargazers', () => {
  let source;

  afterAll(mockGithub.afterAll);
  beforeAll(mockGithub.beforeAll);

  beforeEach(() => {
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
