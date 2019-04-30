const { id: gql } = require('common-tags');
const { queryAll } = require('./client');
const { userFields, paging } = require('./fragements');

const repositoryIssues = gql`
  query repositoryIssues(
    $name: String!
    $owner: String!
    $count: Int = 100
    $cursor: String = null
  ) {
    repository(name: $name, owner: $owner) {
      issues(first: $count, after: $cursor) {
        pageInfo {
          ...paging
        }
        edges {
          node {
            id
            number

            timeline(last: 1) {
              edges {
                cursor
              }
            }

            reactions(last: 1) {
              edges {
                cursor
              }
            }
          }
        }
      }
    }
  }

  ${paging}
`;

const repositoryIssueTimeline = gql`
  query repositoryIssueTimeline(
    $id: ID!
    $count: Int = 100
    $cursor: String = null
  ) {
    node(id: $id) {
      ... on Issue {
        timeline(first: $count, after: $cursor) {
          pageInfo {
            ...paging
          }

          edges {
            cursor
            node {
              __typename
              ... on IssueComment {
                createdAt
                author {
                  ...userFields
                }
              }

              ... on SubscribedEvent {
                createdAt
                actor {
                  ...userFields
                }
              }

              ... on UnsubscribedEvent {
                createdAt
                actor {
                  ...userFields
                }
              }
            }
          }
        }
      }
    }
  }

  ${paging}
  ${userFields}
`;

const repositoryIssueReactions = gql`
  query repositoryIssueReactions(
    $id: ID!
    $count: Int = 100
    $cursor: String = null
  ) {
    node(id: $id) {
      ... on Issue {
        reactions(first: $count, after: $cursor) {
          pageInfo {
            ...paging
          }
          edges {
            cursor
            node {
              createdAt
              content
              user {
                ...userFields
              }
            }
          }
        }
      }
    }
  }

  ${paging}
  ${userFields}
`;

module.exports = {
  queryIssues: variables =>
    queryAll({
      query: repositoryIssues,
      variables,
      selector: ({ repository }) => repository.issues
    }),
  queryIssueTimeline: variables =>
    queryAll({
      query: repositoryIssueTimeline,
      variables,
      selector: ({ node }) => node.timeline
    }),
  queryIssueReactions: variables =>
    queryAll({
      query: repositoryIssueReactions,
      variables,
      selector: ({ node }) => node.reactions
    })
};
