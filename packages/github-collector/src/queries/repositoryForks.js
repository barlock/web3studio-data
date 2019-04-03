const { id: gql } = require('common-tags');
const { queryAll } = require('./client');
const { userFields, paging } = require('./fragements');

const query = gql`
  query repository(
    $name: String = "web3studio-bootleg"
    $owner: String = "consensys"
    $count: Int = 100
    $cursor: String = null
  ) {
    repository(name: $name, owner: $owner) {
      forks(first: $count, after: $cursor) {
        pageInfo {
          ...paging
        }
        edges {
          cursor
          node {
            createdAt
            owner {
              ...userFields
            }
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
    selector: ({ repository }) => repository.forks
  });
