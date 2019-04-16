const { toArray } = require('rxjs/operators');
const collector = require('./collector');
const TestTransport = require('../test/TestTransport');
const mockGithub = require('../test/fixtures/mockGithub');

describe('The collector', () => {
  let source;
  let transport;

  beforeAll(() => {
    mockGithub.beforeAll();
  });

  afterAll(() => {
    mockGithub.afterAll();
  });

  beforeEach(() => {
    transport = new TestTransport();
    source = collector(transport).pipe(toArray());
  });

  it('Collects fork events', async () => {
    const results = await source.toPromise();
    const forks = results.filter(event => event.event === 'fork');

    expect(forks.length).toBeGreaterThan(0);
  });

  it('Collects stargazer events', async () => {
    const results = await source.toPromise();
    const stargazers = results.filter(event => event.event === 'stargazer');

    expect(stargazers.length).toBeGreaterThan(0);
  });

  it('annotates events with user groups', async () => {
    const results = await source.toPromise();

    expect(results.length).toBeGreaterThan(0);

    results.forEach(event => {
      expect(event).toHaveProperty('meta.user.group');
    });
  });

  it('logs events to a provided transport', async () => {
    const results = await source.toPromise();
    expect(results.length).toBeGreaterThan(0);

    results.forEach(({ event, ...data }, index) => {
      const log = transport.logs()[index];

      expect(log).toEqual(
        expect.objectContaining({
          ...data,
          message: event
        })
      );
    });
  });
});
