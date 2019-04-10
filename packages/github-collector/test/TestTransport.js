const Transport = require('winston-transport');

module.exports = class TestTransport extends Transport {
  /**
   * Create a test Transport
   *
   * @param {Object} ops - Transport options
   */
  constructor(ops) {
    super(ops);
    this.logs = [];
  }

  /**
   * Collect a log
   *
   * @param {Object} info - The thing that was logged
   * @param {Function} callback - Done callback
   */
  log(info, callback) {
    this.logs.push(info);
    callback();
  }
};
