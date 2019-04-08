const { id: gql } = require('common-tags');
const { queryAll } = require('./client');
const { paging } = require('./fragements');

const query = gql`
  query organizationRepositories(
    $login: String!
    $count: Int = 100
    $cursor: String = null
  ) {
    organization(login: $login) {
      repositories(first: $count, after: $cursor) {
        pageInfo {
          ...paging
        }
        edges {
          cursor
          node {
            nameWithOwner
            repositoryTopics(first: 100) {
              edges {
                node {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ${paging}
`;

module.exports = () =>
  queryAll({
    query,
    variables: {
      login: 'ConsenSys'
    },
    selector: ({ organization }) => organization.repositories
  });
