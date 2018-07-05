import Server from './Models/Server'
import Match from './Models/Match'
import LogUserActivity from './Models/LogUserActivity'
import bot from './bot'
import NotifyStreams from "./Listeners/NotifyStreams"
import utils from "./Utilities/utils"
const moment = require('moment');
const Gamedig = require('gamedig');

/**
 * Tasks to perform. Checked every minute
 */
const init = () => {
    const oneMinute = 60000
    const threeMinutes = 180000

    setInterval(() => {
        // console.log('Tasks running...')
        lookForDestroyableServers()
        cancelNonStartedInactiveMatches()
        clientinfo()

    }, oneMinute)

    setInterval(async () => {
        const streams : any = await utils.getStreams(true)

        if (streams.length === 0) return

        const channel = await bot.getChannel('COD1 Community', 'general')

        if (! channel) return

        new NotifyStreams().handle(channel, streams, 'New stream started right now!')
    }, threeMinutes)
    clientinfo();
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
const clientinfo = async () => {
    if (!bot.isReady()) {
        return
    }

    const onlineplayers = await bot.getClient().users.filter(user => {
        return user.bot === false && user.presence.status !== 'offline'
    });

    onlineplayers.forEach(async onlinedata => {
        if (onlinedata.presence.game === null) {
        }
        else {
            console.log(onlinedata.username, onlinedata.id);
        }

        await LogUserActivity
            .query()
            .insert(
                {
                    id: onlinedata.id,
                    game: onlinedata.presence.game ? onlinedata.presence.game.name : null,
                    username: onlinedata.username,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                })
    });
}
export default {
    init
}

