const { id: gql } = require('common-tags');
const { queryAll } = require('./client');
const { userFields, paging } = require('./fragements');

const query = gql`
  query repository(
    $name: String!
    $owner: String!
    $count: Int = 100
    $cursor: String = null
  ) {
    repository(name: $name, owner: $owner) {
      stargazers(first: $count, after: $cursor) {
        pageInfo {
          ...paging
        }
        edges {
          cursor
          starredAt
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
    selector: ({ repository }) => repository.stargazers
  });
