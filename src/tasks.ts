import Server from './Models/Server'
import Match from './Models/Match'
const moment = require('moment');
const Gamedig = require('gamedig');

/**
 * Tasks to perform. Checked every minute
 */
const init = () => {
    setInterval(() => {
        // console.log('Tasks running...')
        lookForDestroyableServers()
        cancelNonStartedInactiveMatches()
    }, 60000)
}

const lookForDestroyableServers = () => {
    Server
        .query()
        .where('destroy_at', '<', moment().format('YYYY-MM-DD HH:mm:ss'))
        .where('destroyed_at', null)
        .whereNotNull('ip')
        .where('user_id', null) // user provided servers can't be destroyed
        .then(servers => {
            if (servers.length) {
                console.log('Destroying servers', servers)
            }

            servers.forEach(async server => {
                let isEmpty = true

                try {
                    const serverInfo = server.ip.split(':')

                    const gameState = await Gamedig.query({
                        type: 'cod',
                        host: serverInfo[0],
                        port: serverInfo[1]
                    })

                    isEmpty = gameState.players.length === 0
                } catch (e) {
                    console.log('Error querying server', e)
                }

                if (! isEmpty) {
                    return;
                }

                const match = await server.getMatch()

                match.cancel(Match.REMOVAL_REASONS.ENDED)
            })
        })
}

const cancelNonStartedInactiveMatches = ()=> {
    Match.getRecentMatchesQuery()
        .where('canceled_reason', null) // Not already canceled
        .where('server_id', null) // The match did not start
        .where(
            'last_activity_at',
            '<',
            moment()
            .subtract('15', 'minutes')
            .format('YYYY-MM-DD HH:mm:ss')
        )
        .then(matches => {
            if (matches.length) {
                console.log('Canceling matches', matches)
            }

            matches.forEach(async match => {
                match.cancel(Match.REMOVAL_REASONS.INACTIVITY)
            })
        })
}

export default {
    init
}
