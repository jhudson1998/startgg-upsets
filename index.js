const {GraphQLClient} = require('graphql-request');
const {
    tourneyByProvinceQuery,
    eventByTourneyQuery,
    setsByEventQuery
} = require('./queries');
const _ = require('lodash');

require('dotenv').config();

//to store data regarding seed difference when upset occurs and how often
//each objects name reflects difference of seeds (object 2 could be 6 seed vs 8 seed or 1 seed vs 3 seed)
let upsets = {
    1: {
        upset: 0,
        total: 0
    },
    2: {
        upset: 0,
        total: 0
    },
    3: {
        upset: 0,
        total: 0
    },
    4: {
        upset: 0,
        total: 0
    },
    5: {
        upset: 0,
        total: 0
    },
    6: {
        upset: 0,
        total: 0
    },
    7: {
        upset: 0,
        total: 0
    },
    8: {
        upset: 0,
        total: 0
    },
    9: {
        upset: 0,
        total: 0
    },
    10: {
        upset: 0,
        total: 0
    },
    11: {
        upset: 0,
        total: 0
    },
    12: {
        upset: 0,
        total: 0
    },
    13: {
        upset: 0,
        total: 0
    },
    14: {
        upset: 0,
        total: 0
    },
    15: {
        upset: 0,
        total: 0
    },
    16: {
        upset: 0,
        total: 0
    },
    17: {
        upset: 0,
        total: 0
    },
    18: {
        upset: 0,
        total: 0
    },
    19: {
        upset: 0,
        total: 0
    },
    20: {
        upset: 0,
        total: 0
    },
    21: {
        upset: 0,
        total: 0
    },
    22: {
        upset: 0,
        total: 0
    },
    23: {
        upset: 0,
        total: 0
    },
    24: {
        upset: 0,
        total: 0
    },
    25: {
        upset: 0,
        total: 0
    },
    26: {
        upset: 0,
        total: 0
    },
    27: {
        upset: 0,
        total: 0
    },
    28: {
        upset: 0,
        total: 0
    },
    29: {
        upset: 0,
        total: 0
    },
    30: {
        upset: 0,
        total: 0
    },
    31: {
        upset: 0,
        total: 0
    },
    32: {
        upset: 0,
        total: 0
    },
}

let tourneyIds;
let eventIds = [];

//need to use for now as to not go over smashgg api limit (80 requests/60 seconds)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const graphQLClient = new GraphQLClient('https://api.start.gg/gql/alpha',
{
    headers: {
        authorization: 'Bearer ' + process.env.SMASHGG_KEY
    }
}
)

const getUpsets = async () => {
    //get all tourneys in province NL
    const tourneysByProvinceResult = await graphQLClient.request(tourneyByProvinceQuery('NL'));
    tourneyIds = _.cloneDeep(tourneysByProvinceResult.tournaments.nodes);
    // tourneyIds.forEach(tourney => {
    //     const eventsByTourneyResult = await graphQLClient.request(eventByTourneyQuery(tourney.id));
    //     await sleep(500);
    // });
    console.log(tourneyIds[0].id);

    //get all individual events given tourney IDs and filter for events with 'singles' in title
    const testResult = await graphQLClient.request(eventByTourneyQuery(tourneyIds[1].id));
    testResult.tournament.events.forEach(element => {
        if(element.name.toLowerCase().includes('singles')) {
            eventIds.push(element.id);
        } 
    });

    //get all sets for each event and get data for each upset
    for(const eventId of eventIds) {
        const setsResult = await graphQLClient.request(setsByEventQuery(eventId));
        const sets = _.cloneDeep(setsResult.event.sets.nodes);
        console.log(sets[0].slots[0]);
        sets.forEach(set => {
            const player1 = {
                seed: parseInt(set.slots[0].seed.seedNum),
                score: parseInt(set.slots[0].standing.stats.score.value)
            };
            const player2 = {
                seed: parseInt(set.slots[1].seed.seedNum),
                score: parseInt(set.slots[1].standing.stats.score.value)
            };
            const seedDifference = player2.seed - player1.seed;
            console.log(player2.seed + ' ' + player1.seed)
            upsets[seedDifference].total += 1;
            if(player2.score > player1.score) {
                upsets[seedDifference].upset += 1;
            }
        });
    }
    console.log(upsets);
}

getUpsets();


