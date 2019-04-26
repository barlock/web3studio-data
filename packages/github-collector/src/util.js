const { from } = require('rxjs');
const { mergeMap, mergeAll, map, filter } = require('rxjs/operators');
const _ = require('lodash');

/**
 * Combine a source observable with the last logged event
 *
 * @param {Object} opts - options
 * @param {string} opts.event - Event to target
 * @param {Function} opts.query - Additional query to pass to the transport
 * @param {Transport} opts.transport - The collector transport
 * @returns {Observable} Observable of zipped items and last event logged for it
 */
const mergeLastOfType = ({ event, query, transport }) => source$ => {
  return source$.pipe(
    mergeMap(item =>
      from(transport.lastEventOfType(event, query(item))).pipe(
        map(lastEvent => [item, lastEvent])
      )
    )
  );
};

/**
 * Create an observable from a client query
 *
 * @param {Promise} query - Client promise
 * @returns {Observable<any>} - The results of the query
 */
const fromQuery = query => from(query).pipe(mergeAll());

/**
 * Many calls can be expensive. Filter extra request if we've already got the last cursor
 *
 * @param {string} cursorPath - JSON Path to the cursor
 * @returns {Operator} Filter operator
 */
const filterUpToDateCursor = cursorPath =>
  filter(([item, lastEvent]) => _.get(item, cursorPath) !== lastEvent.cursor);

module.exports = {
  mergeLastOfType,
  fromQuery,
  filterUpToDateCursor
};
