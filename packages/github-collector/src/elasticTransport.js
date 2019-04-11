const ElasticSearch = require('winston-elasticsearch');
const doWhilst = require('p-do-whilst');

// Gracefully close the application when there are no more logs
// https://github.com/vanthome/winston-elasticsearch/issues/17#issuecomment-479679866
ElasticSearch.prototype.end = async function() {
  const bulkWriter = this.bulkWriter;
  bulkWriter.stop();

  await doWhilst(() => bulkWriter.flush(), () => bulkWriter.bulk.length > 0);

  this.emit('finish');
};

module.exports = opts =>
  new ElasticSearch({
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
  });
