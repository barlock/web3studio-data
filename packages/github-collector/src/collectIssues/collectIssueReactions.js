const { from } = require('rxjs');
const { mergeMap, mergeAll, map } = require('rxjs/operators');
const { queryIssueReactions } = require('../queries/repositoryIssues');
const _ = require('lodash');

const event = 'issueReaction';

module.exports = (repo, transport) => issues => {
  return issues.pipe(
    mergeMap(
      issue =>
        from(transport.lastEventOfType(event, { issueId: issue.id })).pipe(
          mergeMap(lastEvent =>
            from(
              // These calls can be expensive as there are a lot of issues.
              // Prevent extra request if we've already got the last cursor
              _.get(issue, 'reactions.edges[0].cursor') !== lastEvent.cursor
                ? queryIssueReactions({
                    id: issue.id,
                    cursor: lastEvent.cursor
                  })
                : []
            ).pipe(
              mergeAll(),
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
            )
          )
        ),
      2
    )
  );
};
