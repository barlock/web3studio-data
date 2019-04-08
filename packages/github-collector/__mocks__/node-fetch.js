const nodeFetch = jest.requireActual('node-fetch');
const fetchMock = require('fetch-mock/es5/server').sandbox();

Object.assign(fetchMock.config, nodeFetch, {
  fetch: nodeFetch
});

module.exports = { default: fetchMock };
