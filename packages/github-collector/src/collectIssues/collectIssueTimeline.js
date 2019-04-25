const { from } = require('rxjs');
const { mergeMap, mergeAll, filter, map } = require('rxjs/operators');
const { queryIssueTimeline } = require('../queries/repositoryIssues');
const _ = require('lodash');

const event = 'timeline';

module.exports = (repo, transport) => issues => {
  return issues.pipe(
    mergeMap(
      issue =>
        from(transport.lastEventOfType(event, { issueId: issue.id })).pipe(
          mergeMap(lastEvent =>
            from(
              // These calls can be expensive as there are a lot of issues.
              // Prevent extra request if we've already got the last cursor
              _.get(issue, 'timeline.edges[0].cursor') !== lastEvent.cursor
                ? queryIssueTimeline({
                    id: issue.id,
                    cursor: lastEvent.cursor
                  })
                : []
            ).pipe(
              mergeAll(),
              filter(
                timelineItem =>
                  // Remove timeline events that we didn't get any data for
                  Object.keys(timelineItem.node).filter(
                    key => key !== '__typename'
                  ).length > 0
              ),
              map(timelineEvent => {
                const node = timelineEvent.node;

                return {
                  event,
                  timestamp: node.createdAt,
                  meta: {
                    type: node.__typename,
                    issueId: issue.id,
                    issueNumber: issue.number,
                    cursor: timelineEvent.cursor,
                    user: node.actor || node.author,
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
