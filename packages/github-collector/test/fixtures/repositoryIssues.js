/**
 * Get fixtures for repository issues
 *
 * @returns {Object} issue fixture
 */
const fixture = () => ({
  data: {
    repository: {
      issues: {
        pageInfo: {
          hasNextPage: false,
          endCursor: 'Y3Vyc29yOnYyOpHOGKBOkA=='
        },
        edges: [
          {
            node: {
              id: 'MDU6SXNzdWUzOTg0MjczNzY=',
              number: 1,
              timeline: {
                edges: [
                  {
                    cursor: 'MjM'
                  }
                ]
              },
              reactions: {
                edges: [
                  {
                    cursor: 'Y3Vyc29yOnYyOpHOAnplcQ=='
                  }
                ]
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTkyNzY0ODQ=',
              number: 3,
              timeline: {
                edges: [
                  {
                    cursor: 'MQ'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTkyOTI4MjM=',
              number: 4,
              timeline: {
                edges: [
                  {
                    cursor: 'MTI'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk0ODExNDU=',
              number: 5,
              timeline: {
                edges: [
                  {
                    cursor: 'MTE'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk1MjYwNjU=',
              number: 8,
              timeline: {
                edges: [
                  {
                    cursor: 'NQ'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk1MjYzMTU=',
              number: 9,
              timeline: {
                edges: [
                  {
                    cursor: 'OA'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk1MjY2MzI=',
              number: 10,
              timeline: {
                edges: [
                  {
                    cursor: 'NQ'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk5MDczMzY=',
              number: 11,
              timeline: {
                edges: [
                  {
                    cursor: 'OQ'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk5MTY1MTE=',
              number: 12,
              timeline: {
                edges: [
                  {
                    cursor: 'MTA'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk5NzQyMDM=',
              number: 13,
              timeline: {
                edges: [
                  {
                    cursor: 'Mw'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk5NzU3MjI=',
              number: 14,
              timeline: {
                edges: [
                  {
                    cursor: 'Mw'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWUzOTk5ODE2MTA=',
              number: 15,
              timeline: {
                edges: [
                  {
                    cursor: 'Mw'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWU0MDAzMzA5OTQ=',
              number: 16,
              timeline: {
                edges: [
                  {
                    cursor: 'MTA'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWU0MDA0NDA2NzY=',
              number: 17,
              timeline: {
                edges: [
                  {
                    cursor: 'OQ'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWU0MDA0NDEwMTg=',
              number: 18,
              timeline: {
                edges: [
                  {
                    cursor: 'MQ'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWU0MDA0NDY5NTE=',
              number: 19,
              timeline: {
                edges: [
                  {
                    cursor: 'OA'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          },
          {
            node: {
              id: 'MDU6SXNzdWU0MDA1MTYyOTE=',
              number: 20,
              timeline: {
                edges: [
                  {
                    cursor: 'OQ'
                  }
                ]
              },
              reactions: {
                edges: []
              }
            }
          }
        ]
      }
    }
  }
});

/**
 * Get the edges that you care about from this fixture
 *
 * @returns {Object} Issue edges
 */
const edges = () => fixture().data.repository.issues.edges;

module.exports = fixture;
module.exports.edges = edges;
