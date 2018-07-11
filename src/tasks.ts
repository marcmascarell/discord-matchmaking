import Server from './Models/Server'
import Match from './Models/Match'
import bot from './bot'
import NotifyStreams from "./Listeners/NotifyStreams"
import utils from "./Utilities/utils"
const Gamedig = require('gamedig');
import LogUserActivity from './Models/LogUserActivity'
import LogProcessedActivity from "./Models/LogProcessedActivity";
const moment = require('moment');
const _ = require('lodash');

/**
 * Tasks to perform. Checked every minute
 */
const init = () => {
    const oneMinute = 60000
    const threeMinutes = 180000
    const oneDay = 86400000

    setInterval(() => {
        // console.log('Tasks running...')
        lookForDestroyableServers()
        cancelNonStartedInactiveMatches()
    }, oneMinute)

    setInterval(() => {
        logUsersActivity()
        lookForNewStreams()
    }, threeMinutes)

    setInterval(() => {
        processActivity()
    }, oneDay)
}

const lookForNewStreams = async () => {
    try {
        const streams : any = await utils.getStreams(true)

        if (streams.length === 0) return

        const channel = await bot.getChannel('COD1 Community', 'general')

        if (! channel) return

        new NotifyStreams().handle(channel, streams, 'New stream started right now!')
    } catch (e) {
        console.log(e)
    }
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

const logUsersActivity = async () => {
    if (!bot.isReady()) {
        return
    }

    const onlineUsers = await bot.getClient().users.filter(user => {
        return user.bot === false && user.presence.status !== 'offline'
    });

    onlineUsers.forEach(async user => {
        await LogUserActivity
            .query()
            .insert(
                {
                    id: user.id,
                    game: user.presence.game ? user.presence.game.name : null,
                    username: user.username,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                })
    });
}

// Log Users Activity query
const processActivity = async () => {
    const activity = await LogUserActivity.query()

    const groupedActivity = _.groupBy(activity, (item : LogUserActivity) => {
        return moment(item.createdAt).format('YYYY-MM-DD HH:00:00')
    })

    _.each(groupedActivity, async (items : Array<LogUserActivity>, date) => {
        const onlinePlaying = _.uniq(
            items.filter(item => item.game)
                .map(item => item.id)
        );

        const justOnline = _.uniq(
            items.filter(item => !item.game)
                .map(item => item.id)
        );

        try {
            const successInsert = await LogProcessedActivity
                .query()
                .insert(
                    {
                        online: justOnline.join(','),
                        playing: onlinePlaying.join(','),
                        online_at: date
                    })

            if (successInsert) {
                await LogUserActivity
                    .query()
                    .delete()
            }
        } catch (e) {
            console.log('Something went wrong when inserting processed log.', e.stack)
        }
    });
}

export default {
    init
}

