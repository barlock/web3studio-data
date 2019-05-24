const { from, combineLatest } = require('rxjs');
const { map } = require('rxjs/operators');
const organizationMembers = require('./queries/organizationMembers');
const organizationTeamMembers = require('./queries/organizationTeamMembers');
const _ = require('lodash');

/**
 * Augment user objects found in events
 *
 * @param {Array<Object>} organizations - List of organizations to annotate users with
 * @returns {Function} Observable Function
 */
module.exports = ({ organizations }) => source$ => {
  // Source of all organization members as an array of IDs
  const organizationMembers$ = combineLatest(
    organizations.map(org =>
      from(organizationMembers(org.login)).pipe(
        map(orgMembers => ({
          login: org.login,
          members: orgMembers.map(user => user.node.id)
        }))
      )
    )
  );

  const teamMembers$ = combineLatest(
    _(organizations)
      .filter(org => org.teams)
      .flatMap(org =>
        org.teams.map(team =>
          from(organizationTeamMembers(org.login, team)).pipe(
            map(users => ({
              team,
              members: users.map(user => user.node.id)
            }))
          )
        )
      )
      .value()
  );

  // Add `group` based on known github organizations and teams
  return combineLatest(source$, organizationMembers$, teamMembers$).pipe(
    map(([event, organizations, teams]) => {
      const user = event.meta.user;

      if (!user) {
        return event;
      }

      const userOrgs = organizations
        .filter(org => org.members.includes(user.id))
        .map(org => org.login);

      const userTeams = teams
        .filter(team => team.members.includes(user.id))
        .map(team => team.team);

      event.meta.user.orgs = userOrgs;
      event.meta.user.teams = userTeams;

      return event;
    })
  );
};
