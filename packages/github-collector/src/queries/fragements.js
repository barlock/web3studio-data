const { id: gql } = require('common-tags');

module.exports = {
  userFields: gql`
    fragment userFields on User {
      id
      login
    }
  `,
  paging: gql`
    fragment paging on PageInfo {
      hasNextPage
      endCursor
    }
  `
};
