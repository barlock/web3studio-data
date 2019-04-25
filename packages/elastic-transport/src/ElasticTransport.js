const { Client } = require('elasticsearch');
const winston = require('winston');
const ElasticSearch = require('winston-elasticsearch');
const doWhilst = require('p-do-whilst');
const _ = require('lodash');

// Gracefully close the application when there are no more logs
// https://github.com/vanthome/winston-elasticsearch/issues/17#issuecomment-479679866
ElasticSearch.prototype.end = async function() {
  const bulkWriter = this.bulkWriter;
  bulkWriter.stop();

  await doWhilst(() => bulkWriter.flush(), () => bulkWriter.bulk.length > 0);

  this.emit('finish');
};

/**
 * A Data collector transport that sends data to ElasticSearch
 */
class ElasticTransport {
  /**
   * Create a new Elastic Search Transport
   *
   * @param {Object} options - Configuration options
   * @param {Object} options.clientOpts - Options passed to the elasticsearch client
   * @param {Array} options.transports - list of additional winston transports for the logger
   * @param {...Object} options.opts - Additional options for winston-elasticsearch
   */
  constructor({ clientOpts, transports = [], ...opts } = {}) {
    this._client = new Client({
      ...clientOpts
    });

    this.logger = winston.createLogger({
      transports: [
        ...transports,
        new ElasticSearch({
          client: this._client,
          indexPrefix: 'logs-' + Date.now(),
          transformer: data => {
            const { timestamp, meta } = data.meta;

            return {
              '@timestamp': timestamp,
              severity: data.level,
              message: data.message,
              event: data.message,
              ...meta
            };
          },
          ...opts
        })
      ]
    });
  }

  /**
   * Gets the last event of a specific type that was logged
   *
   * @param {string} eventType - The event type logged
   * @param {Object} query - Any addtional key/value pairs to search for
   * @returns {Promise<Object>} The event
   */
  async lastEventOfType(eventType, query = {}) {
    const searchParams = {
      body: {
        sort: [{ '@timestamp': { order: 'desc', unmapped_type: 'boolean' } }],
        query: {
          bool: {
            filter: [
              ...Object.entries(query).map(([key, value]) => ({
                bool: {
                  should: [
                    {
                      match_phrase: {
                        [`${key}.keyword`]: value
                      }
                    }
                  ],
                  minimum_should_match: 1
                }
              })),
              {
                bool: {
                  should: [{ match_phrase: { 'event.keyword': eventType } }],
                  minimum_should_match: 1
                }
              }
            ]
          }
        },
        size: 1
      }
    };

    const result = await this._client.search(searchParams);

    return _.get(result, 'hits.hits[0]._source', {});
  }
}

module.exports = ElasticTransport;
