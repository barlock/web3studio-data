const fetchMock = require('node-fetch').default;

const { toArray, map } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const orgReposResponse = require('../test/fixtures/organizationRepositories');

describe('collectRepos', () => {
  let source$;

  beforeAll(() => {
    fetchMock.post('*', () => orgReposResponse());
  });

  afterAll(() => {
    fetchMock.reset();
  });

  beforeEach(() => {
    source$ = collectRepos({
      organizations: [{ name: 'consensys', teams: ['web3studio'] }],
      projectTopicFilters: ['web3studio-']
    });
  });

  it("filters repos that don't have web3studio project topics", async () => {
    const results = await source$.pipe(toArray()).toPromise();

    expect(results.length).toEqual(11);

    results.forEach(repo =>
      repo.projects.forEach(project =>
        expect(project).toEqual(expect.stringMatching(/^web3studio-/))
      )
    );
  });

  it('returns the name and owner of repos', async () => {
    const results = await source$
      .pipe(
        map(repo => ({ name: repo.name, owner: repo.owner })),
        toArray()
      )
      .toPromise();

    expect(results).toMatchSnapshot();
  });

  it('has a list of projects based on topics', async () => {
    const projects = await source$
      .pipe(
        map(repo => repo.projects),
        toArray()
      )
      .toPromise();

    expect(projects).toMatchSnapshot();
  });
});
