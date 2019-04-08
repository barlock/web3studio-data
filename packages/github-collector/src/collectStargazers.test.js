const { toArray, take } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectStargazers = require('./collectStargazers');
const mockGithub = require('../test/fixtures/mockGithub');
const TestTransport = require('../test/TestTransport');

describe('collectStargazers', () => {
  let source;
  let transport;

  afterAll(mockGithub.afterAll);
  beforeAll(mockGithub.beforeAll);

  beforeEach(() => {
    mockGithub.beforeEach();
    transport = new TestTransport();
    source = collectRepos().pipe(take(1));
  });

  it('Collects repo stargazers and passes as events', async () => {
    const results = await source
      .pipe(
        collectStargazers(transport),
        toArray()
      )
      .toPromise();

    expect(results.length).toEqual(20);

    expect(results).toMatchSnapshot();
  });

  it('Picks up from the last cursor', async () => {
    transport.mockLastEvent = { cursor: 'someCursor' };

    await source
      .pipe(
        collectStargazers(transport),
        toArray()
      )
      .toPromise();

    const requests = mockGithub.requests();

    // Second request is fetching the repo
    expect(requests[1].variables.cursor).toEqual(
      transport.mockLastEvent.cursor
    );
  });
});
