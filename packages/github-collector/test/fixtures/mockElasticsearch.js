const nock = require('nock');

let logs = [];

module.exports = {
  beforeAll: () => {
    logs = [];

    nock.disableNetConnect();
    nock('http://localhost:9200')
      .post(() => true)
      // .delayBody(1)
      .reply(200, (uri, body) => {
        logs = logs.concat(
          body
            .trim()
            .split('\n')
            .map(line => JSON.parse(line))
            .filter(log => !log.index)
        );
        //TODO split, parse, push
        return {
          errors: [],
          items: []
        };
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
  afterAll: () => {
    nock.cleanAll();
    nock.enableNetConnect();
  },
  logs: () => logs
};
