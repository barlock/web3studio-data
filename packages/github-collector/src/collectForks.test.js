const { toArray, take } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectForks = require('./collectForks');
const mockGithub = require('../test/fixtures/mockGithub');
const TestTransport = require('../test/TestTransport');

describe('collectForks', () => {
  let source;
  let transport;

  afterAll(mockGithub.afterAll);
  beforeAll(mockGithub.beforeAll);

  beforeEach(() => {
    mockGithub.beforeEach();
    transport = new TestTransport();
    source = collectRepos().pipe(take(1));
  });

  it('Collects repo forks and passes as events', async () => {
    const results = await source
      .pipe(
        collectForks(transport),
        toArray()
      )
      .toPromise();

    expect(results.length).toEqual(7);

    expect(results).toMatchSnapshot();
  });

  it('Picks up from the last cursor', async () => {
    transport.mockLastEvent = { cursor: 'someCursor' };

    await source
      .pipe(
        collectForks(transport),
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
