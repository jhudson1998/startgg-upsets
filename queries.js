const {gql} = require('graphql-request');

function tourneyByProvinceQuery(stateCode) {
    return gql`
    query {
        tournaments(query: {
          perPage: 500
          filter: {
            addrState: "` + stateCode + `"
          }
        }) {
          nodes {
            id
          }
        }
      }
    `
}

function eventByTourneyQuery(tourneyId) {
    return gql`
    query {
        tournament(id: "` + tourneyId + `"){
            events{
                id
                name
            }
        }
    }
    `
}

function setsByEventQuery(eventId) {
    return gql`
    query InProgressSets {
        event(id: ` + eventId + `) {
          id
          name
          sets(
            page: 1
            perPage: 100
            sortType: STANDARD
          ) {
            pageInfo {
              total
            }
            nodes {
              id
              state
              slots {
                id
                seed {
                    seedNum
                }
                standing {
                    stats {
                        score {
                            value
                        }
                    }
                }
                entrant {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `
}

module.exports = {tourneyByProvinceQuery, eventByTourneyQuery, setsByEventQuery}