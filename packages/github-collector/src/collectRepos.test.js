const fetchMock = require('node-fetch').default;

const { toArray, map } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const orgReposResponse = require('../test/fixtures/organizationRepositories');

describe('collectRepos', () => {
  beforeAll(() => {
    fetchMock.post('*', () => orgReposResponse());
  });

  afterAll(() => {
    fetchMock.reset();
  });

  it("filters repos that don't have web3studio project topics", async () => {
    const results = await collectRepos()
      .pipe(toArray())
      .toPromise();

    expect(results.length).toEqual(11);

    results.forEach(repo =>
      repo.projects.forEach(project =>
        expect(project).toEqual(expect.stringMatching(/^web3studio-/))
      )
    );
  });

  it('returns the name and owner of repos', async () => {
    const results = await collectRepos()
      .pipe(
        map(repo => ({ name: repo.name, owner: repo.owner })),
        toArray()
      )
      .toPromise();

    expect(results).toMatchSnapshot();
  });

  it('has a list of projects based on topics', async () => {
    const projects = await collectRepos()
      .pipe(
        map(repo => repo.projects),
        toArray()
      )
      .toPromise();

    expect(projects).toMatchSnapshot();
  });
});
