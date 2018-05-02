const Server = require('./Models/Server');
const Match = require('./Models/Match');
const moment = require('moment');

/**
 * Tasks to perform. Checked every minute
 */
const init = () => {
    setInterval(() => {
        // console.log('Tasks running...')
        lookForDestroyableServers()
        cancelInactiveMatches()
    }, 60000)
}

const lookForDestroyableServers = () => {
    Server
        .query()
        .whereNot('ip', null) // Avoid test servers
        .where('destroy_at', '<', moment().format('YYYY-MM-DD HH:mm:ss'))
        .where('destroyed_at', null)
        .then(servers => {
            if (servers.length) {
                console.log('Destroying servers', servers)
            }

            servers.forEach(server => {
                server.destroy()
            })
        })
}

const cancelInactiveMatches = ()=> {
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

            matches.forEach(match => {
                match.cancel(Match.REMOVAL_REASONS.INACTIVITY)
            })
        })
}

module.exports = {
    init
}
