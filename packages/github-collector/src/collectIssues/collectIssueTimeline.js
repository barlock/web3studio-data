const { mergeMap, filter, map } = require('rxjs/operators');
const { queryIssueTimeline } = require('../queries/repositoryIssues');
const { fromQuery, mergeLastOfType, filterUpToDateCursor } = require('../util');

const event = 'timeline';

module.exports = (repo, transport) => issues$ => {
  return issues$.pipe(
    mergeLastOfType({
      event,
      transport,
      query: issue => ({ issueId: issue.id })
    }),
    filterUpToDateCursor('timeline.edges[0].cursor'),
    mergeMap(
      ([issue, lastEvent]) =>
        fromQuery(
          queryIssueTimeline({
            id: issue.id,
            cursor: lastEvent.cursor
          })
        ).pipe(
          filter(
            timelineItem =>
              // Remove timeline events that we didn't get any data for
              Object.keys(timelineItem.node).filter(key => key !== '__typename')
                .length > 0
          ),
          map(({ cursor, node: timelineEvent }) => {
            return {
              event,
              timestamp: timelineEvent.createdAt,
              meta: {
                cursor,
                type: timelineEvent.__typename,
                issueId: issue.id,
                issueNumber: issue.number,
                user: timelineEvent.actor || timelineEvent.author,
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
