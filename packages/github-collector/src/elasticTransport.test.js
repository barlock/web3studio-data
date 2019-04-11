const winston = require('winston');
const elasticTransport = require('./elasticTransport');
const mockGithub = require('../test/fixtures/mockGithub');
const mockElasticsearch = require('../test/fixtures/mockElasticsearch');

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
  let logger;

  beforeAll(() => {
    mockGithub.beforeAll();
    mockElasticsearch.beforeAll();
  });

  afterAll(() => {
    mockGithub.afterAll();
    mockElasticsearch.afterAll();
  });

  beforeEach(() => {
    transport = elasticTransport({
      clientOpts: {
        // log: NullLogger,
        keepAlive: false
      }
    });
    logger = winston.createLogger({ transports: [transport] });
  });

  it.only('Maps events into an elastic consumable form', done => {
    logger.on('finish', () => {
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

    logger.info(event('test1'));
    logger.info(event('test2'));
    logger.info(event('test3'));
    logger.info(event('test4'));

    logger.end();
  });
});
