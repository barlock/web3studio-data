module.exports = () => ({
  data: {
    node: {
      timeline: {
        edges: [
          {
            cursor: 'MQ',
            node: {
              __typename: 'CrossReferencedEvent'
            }
          },
          {
            cursor: 'Mg',
            node: {
              __typename: 'IssueComment',
              createdAt: '2019-04-04T13:58:09Z',
              author: {
                id: 'MDQ6VXNlcjE2MjQ=',
                login: 'breakpointer'
              }
            }
          },
          {
            cursor: 'Mw',
            node: {
              __typename: 'AssignedEvent'
            }
          },
          {
            cursor: 'NA',
            node: {
              __typename: 'IssueComment',
              createdAt: '2019-04-18T17:20:16Z',
              author: {
                id: 'MDQ6VXNlcjE2MjQ=',
                login: 'breakpointer'
              }
            }
          }
        ]
      }
    }
  }
});
