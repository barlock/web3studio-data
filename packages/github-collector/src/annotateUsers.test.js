const { from } = require('rxjs');
const { toArray, take, map } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectForks = require('./collectForks');
const annotateUsers = require('./annotateUsers');
const mockGithub = require('../test/fixtures/mockGithub');
const TestTransport = require('../test/TestTransport');

describe('annotateUsers', () => {
  let source$;
  let transport;
  const ops = {
    organizations: [{ login: 'consensys', teams: ['web3studio'] }],
    projectTopicFilters: ['web3studio-']
  };

  afterAll(mockGithub.afterAll);
  beforeAll(mockGithub.beforeAll);

  beforeEach(() => {
    transport = new TestTransport();

    mockGithub.beforeAll();

    source$ = collectRepos(ops).pipe(take(1));
  });

  it('Adds data to users to show orgs and teams', async () => {
    const results = await source$
      .pipe(
        collectForks(transport),
        annotateUsers(ops),
        map(event => ({
          orgs: event.meta.user.orgs,
          teams: event.meta.user.teams
        })),
        toArray()
      )
      .toPromise();

    expect(results.length).toEqual(7);

    expect(results).toMatchSnapshot();
  });

  it("passes events that don't contain user data untouched", async () => {
    const event = {
      event: 'ci-passed',
      timestamp: Date.now(),
      meta: {
        commit: 'f10dcce'
      }
    };
    const results = await from([event])
      .pipe(annotateUsers(ops))
      .toPromise();

    expect(results).toEqual(event);
  });
});
