const { from } = require('rxjs');
const { toArray, take, map } = require('rxjs/operators');
const collectRepos = require('./collectRepos');
const collectForks = require('./collectForks');
const annotateUsers = require('./annotateUsers');
const mockGithub = require('../test/fixtures/mockGithub');
const TestTransport = require('../test/TestTransport');

describe('annotateUsers', () => {
  let source;
  let transport;

  afterAll(mockGithub.afterAll);
  beforeAll(mockGithub.beforeAll);

  beforeEach(() => {
    transport = new TestTransport();

    mockGithub.beforeAll();

    source = collectRepos().pipe(take(1));
  });

  it("Adds data to users to show if they're in consensys, web3studio, or other", async () => {
    const results = await source
      .pipe(
        collectForks(transport),
        annotateUsers(),
        map(event => event.meta.user.group),
        toArray()
      )
      .toPromise();

    expect(results.length).toEqual(7);

    expect(results).toMatchSnapshot();
  });

  it("passes events that don't contain user data untouched", async () => {
    const event = {
      event: 'ci-passed',
      timetamp: Date.now(),
      meta: {
        commit: 'f10dcce'
      }
    };
    const results = await from([event])
      .pipe(annotateUsers())
      .toPromise();

    expect(results).toEqual(event);
  });
});
