const { id: gql } = require('common-tags');
const { queryAll } = require('./client');
const { paging } = require('./fragements');

const query = gql`
  query repositories(
    $login: String!
    $slug: String!
    $count: Int = 100
    $cursor: String = null
  ) {
    organization(login: $login) {
      team(slug: $slug) {
        members(first: $count, after: $cursor) {
          pageInfo {
            ...paging
          }
          edges {
            cursor
            node {
              id
            }
          }
        }
      }
    }
  }

  ${paging}
`;

module.exports = (login, slug) =>
  queryAll({
    query,
    variables: {
      login,
      slug
    },
    selector: ({ organization }) => organization.team.members
  });
