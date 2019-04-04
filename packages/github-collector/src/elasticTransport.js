const ElasticSearch = require('winston-elasticsearch');

// Gracefully close the application when there are no more logs
// https://github.com/vanthome/winston-elasticsearch/issues/17#issuecomment-479679866
ElasticSearch.prototype.end = async function() {
  const bulkWriter = this.bulkWriter;
  bulkWriter._append = bulkWriter.append;

  this.bulkWriter.append = (...args) => {
    bulkWriter._append(...args);

    process.nextTick(() => bulkWriter.flush(), 0);
  };

  bulkWriter.stop();
  await bulkWriter.flush();
};

module.exports = () =>
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
    }
  });
