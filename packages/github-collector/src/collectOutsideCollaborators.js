const { mergeMap, map } = require('rxjs/operators');
const repositoryCollaborators = require('./queries/repositoryCollaborators');
const { mergeLastOfType, fromQuery } = require('./util');

const event = 'collaborator';

module.exports = transport => repos$ => {
  return repos$.pipe(
    mergeLastOfType({
      event,
      transport,
      query: repo => ({ repo: repo.nameWithOwner })
    }),
    mergeMap(([repo, lastEvent]) =>
      fromQuery(
        repositoryCollaborators({
          name: repo.name,
          owner: repo.owner,
          cursor: lastEvent.cursor
        })
      ).pipe(
        map(collaborator => {
          return {
            event,
            timestamp: collaborator.node.createdAt,
            meta: {
              cursor: collaborator.cursor,
              projects: repo.projects,
              repo: repo.nameWithOwner,
              user: collaborator.node,
              permission: collaborator.permission,
              permissionSources: collaborator.permissionSources
            }
          };
        })
      )
    )
  );
};
