const { from, combineLatest } = require('rxjs');
const { map } = require('rxjs/operators');
const organizationMembers = require('./queries/organizationMembers');
const organizationTeamMembers = require('./queries/organizationTeamMembers');
const _ = require('lodash');

/**
 * Augment user objects found in events
 *
 * @returns {Function} Observable Function
 */
module.exports = () => source => {
  // Source of all consensys members as an array of IDs
  const consensysMembers = combineLatest(
    from(organizationMembers('consensys')),
    from(organizationMembers('trufflesuite')),
    from(organizationMembers('infura'))
  ).pipe(
    map(orgs =>
      _(orgs)
        .flatMap(org => org.map(user => user.node.id))
        .uniq()
        .value()
    )
  );

  // Source of all web3studio members as an array of IDs
  const web3studioMembers = from(
    organizationTeamMembers('consensys', 'web3studio')
  ).pipe(map(users => users.map(user => user.node.id)));

  // Add `group` based on known github organizations and teams
  return combineLatest(source, consensysMembers, web3studioMembers).pipe(
    map(([event, consensys, web3studio]) => {
      const user = event.meta.user;
      let group = '';

      if (!user) {
        return event;
      }

      if (web3studio.includes(user.id)) {
        group = 'web3studio';
      } else if (consensys.includes(user.id)) {
        group = 'consensys';
      } else {
        group = 'other';
      }

      event.meta.user.group = group;

      return event;
    })
  );
};
