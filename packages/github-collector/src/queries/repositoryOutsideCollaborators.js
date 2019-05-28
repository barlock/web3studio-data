const { id: gql } = require('common-tags');
const { queryAll } = require('./client');
const { userFields, paging } = require('./fragements');

const query = gql`
  query repositoryCollaborators(
    $name: String!
    $owner: String!
    $count: Int = 100
    $cursor: String = null
  ) {
    repository(name: $name, owner: $owner) {
      collaborators(first: $count, after: $cursor, affiliation: OUTSIDE) {
        pageInfo {
          ...paging
        }
        edges {
          permission
          permissionSources {
            permission
            source {
              __typename
              ... on Organization {
                id
                login
              }

              ... on Repository {
                id
                nameWithOwner
              }

              ... on Team {
                id
                combinedSlug
              }
            }
          }
          node {
            ...userFields
          }
        }
      }
    }
  }

  ${userFields}
  ${paging}
`;

module.exports = variables =>
  queryAll({
    query,
    variables,
    selector: ({ repository }) => repository.collaborators
  });
