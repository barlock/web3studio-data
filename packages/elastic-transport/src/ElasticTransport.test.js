const ElasticTransport = require('./ElasticTransport');
const mockElasticsearch = require('../test/mockElasticsearch');

/**
 * Create a test event
 *
 * @param {string} message - Name of the event
 * @returns {Object} - An Event
 */
const event = message => ({
  message,
  timestamp: Date.now(),
  meta: { foo: 'bar' }
});

describe('The elasticsearch Transport', () => {
  let transport;

  beforeAll(() => {
    mockElasticsearch.beforeAll();
  });

  afterAll(() => {
    mockElasticsearch.afterAll();
  });

  beforeEach(() => {
    mockElasticsearch.beforeEach();
    transport = new ElasticTransport();
  });

  it('Maps events into an elastic consumable form', done => {
    transport.logger.on('finish', () => {
      const logs = mockElasticsearch.logs();

      expect(logs.length).toEqual(4);

      logs.forEach(log => {
        expect(log).toHaveProperty('@timestamp');
        expect(log).toHaveProperty('message');
        expect(log).toHaveProperty('event');
        expect(log).toHaveProperty('foo');
      });

      done();
    });

    transport.logger.info(event('test1'));
    transport.logger.info(event('test2'));
    transport.logger.info(event('test3'));
    transport.logger.info(event('test4'));

    transport.logger.end();
  });

  it('can query the last event of a type', async () => {
    await transport.lastEventOfType('TimelordCrushedIt');

    const queries = mockElasticsearch.queries();

    expect(queries.length).toEqual(1);

    expect(queries[0]).toMatchSnapshot();
  });

  it('returns empty object if no event found', async () => {
    const lastEvent = await transport.lastEventOfType('TimelordDidntCrushIt');

    expect(lastEvent).toEqual({});
  });

  it('can pass additional query data for the last event', async () => {
    await transport.lastEventOfType('TimelordCrushedIt', {
      vanquished: 'daleks'
    });

    const queries = mockElasticsearch.queries();

    expect(queries.length).toEqual(1);

    expect(queries[0]).toMatchSnapshot();
  });
});
