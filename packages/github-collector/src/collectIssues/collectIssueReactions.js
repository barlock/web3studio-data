const { mergeMap, map } = require('rxjs/operators');
const { queryIssueReactions } = require('../queries/repositoryIssues');
const { fromQuery, mergeLastOfType, filterUpToDateCursor } = require('../util');

const event = 'issueReaction';

module.exports = (repo, transport) => issues => {
  return issues.pipe(
    mergeLastOfType({
      event,
      transport,
      query: issue => ({ issueId: issue.id })
    }),
    filterUpToDateCursor('reactions.edges[0].cursor'),
    mergeMap(
      ([issue, lastEvent]) =>
        fromQuery(
          queryIssueReactions({
            id: issue.id,
            cursor: lastEvent.cursor
          })
        ).pipe(
          map(({ cursor, node: reaction }) => {
            return {
              event,
              timestamp: reaction.createdAt,
              meta: {
                cursor,
                user: reaction.user,
                content: reaction.content,
                issueId: issue.id,
                issueNumber: issue.number,
                projects: repo.projects,
                repo: repo.nameWithOwner
              }
            };
          })
        ),
      1
    )
  );
};
