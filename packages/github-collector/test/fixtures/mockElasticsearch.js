const nock = require('nock');

let logs = [];
let queries = [];

module.exports = {
  beforeAll: () => {
    nock.disableNetConnect();
    nock('http://localhost:9200')
      .post(() => true)
      // .delayBody(1)
      .reply(200, (uri, body) => {
        if (typeof body === 'string') {
          logs = logs.concat(
            body
              .trim()
              .split('\n')
              .map(line => JSON.parse(line))
              .filter(log => !log.index)
          );

          return {
            errors: [],
            items: []
          };
        } else if (typeof body === 'object') {
          queries.push(body);

          return {
            hits: {
              hits: []
            }
          };
        }
      })
      .persist();

    nock('http://localhost:9200')
      .get(() => true)
      .reply(200)
      .persist();

    nock('http://localhost:9200')
      .head(() => true)
      .reply(200)
      .persist();
  },
  beforeEach: () => {
    logs = [];
    queries = [];
  },
  afterAll: () => {
    nock.cleanAll();
    nock.enableNetConnect();
  },
  logs: () => logs,
  queries: () => queries
};
