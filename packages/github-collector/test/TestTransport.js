const winston = require('winston');
const Transport = require('winston-transport');

/**
 * Mock Winston transport
 */
class TestWinstonTransport extends Transport {
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
}

/**
 * Test collector transport
 */
class TestTransport {
  /**
   * Create a new TestTransport
   */
  constructor() {
    this._transport = new TestWinstonTransport();

    this.logger = winston.createLogger({ transports: [this._transport] });
  }

  /**
   * Get the logs that were logged by the logger
   *
   * @returns {Array} Logged logs
   */
  logs() {
    return this._transport.logs;
  }

  /**
   * Mock of real `lastEventOfType`
   *
   * @returns {Promise<{}>} a fake event
   */
  async lastEventOfType() {
    return {};
  }
}

module.exports = TestTransport;
