const { id: gql } = require('common-tags');
const { queryAll } = require('./client');
const { paging } = require('./fragements');

const query = gql`
  query organizationMembers(
    $login: String!
    $count: Int = 100
    $cursor: String = null
  ) {
    organization(login: $login) {
      membersWithRole(first: $count, after: $cursor) {
        pageInfo {
          ...paging
        }
        edges {
          cursor
          node {
            id
            login
          }
        }
      }
    }
  }

  ${paging}
`;

module.exports = login =>
  queryAll({
    query,
    variables: { login },
    selector: ({ organization }) => organization.membersWithRole
  });
