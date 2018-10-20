import Server from "./Models/Server"
import Match from "./Models/Match"
import LogUserActivity from "./Models/LogUserActivity"
import bot from "./bot"
import NotifyStreams from "./Listeners/NotifyStreams"
import utils from "./Utilities/utils"
import FullServerStatusCard from "./Embeds/FullServerStatusCard"
import secrets from "./secrets"
const Gamedig = require("gamedig")
import LogProcessedActivity from "./Models/LogProcessedActivity"
import User from "./Models/User"
const moment = require("moment")
const _ = require("lodash")

import scheduler from "node-schedule"
import PrepareScheduledMatchesServers from "./Tasks/PrepareScheduledMatchesServers"

let lastPublicServersNotification

/**
 * Tasks to perform. Checked every minute
 */
const init = () => {
    const eachFiveSeconds = "*/5 * * * * *"
    const eachMinute = "0 */1 * * * *"
    const eachThreeMinutes = "0 */3 * * * *"
    const eachFifteenMinutes = "0 */15 * * * *"
    const eachDay = "0 0 0 * * *"

    new PrepareScheduledMatchesServers().autoSchedule()

    // Todo: clean up command to clean unused voice match channels

    scheduler.scheduleJob(eachMinute, () => {
        lookForDestroyableServers()
        cancelNonStartedInactiveMatches()
        cancelNotFullFilledScheduledMatches()
    })

    scheduler.scheduleJob(eachThreeMinutes, () => {
        logUsersActivity()
        lookForNewStreams()
    })

    scheduler.scheduleJob(eachFifteenMinutes, () => {
        monitorPublicServers()
    })

    scheduler.scheduleJob(eachDay, () => {
        processActivity()
    })
}

const monitorPublicServers = async () => {
    const channel = await bot.getChannel("COD1 Community", "general")

    if (!channel) return

    const serversStatus = await utils.fetchServersStatus(secrets.publicServers)

    const embeds = []

    serversStatus
        .filter(serverStatus => serverStatus.players.length >= 14)
        .forEach(gameState => {
            embeds.push(new FullServerStatusCard(gameState).render())
        })

    if (
        (embeds.length && !lastPublicServersNotification) ||
        moment().diff(lastPublicServersNotification, "hour") > 1
    ) {
        embeds.forEach(embed => {
            channel.send(embed)
        })

        lastPublicServersNotification = moment()
    }
}

const lookForNewStreams = async () => {
    try {
        const streams: any = await utils.getStreams(true)

        if (!streams || streams.length === 0) return

        const channel = await bot.getChannel("COD1 Community", "general")

        if (!channel) return

        new NotifyStreams().handle(
            channel,
            streams,
            "New stream started right now!",
        )
    } catch (e) {
        console.log(e)
    }
}

const lookForDestroyableServers = () => {
    Server.query()
        .where("destroy_at", "<", moment().format("YYYY-MM-DD HH:mm:ss"))
        .whereNull("destroyed_at")
        .whereNotNull("ip")
        .whereNull("user_id") // user provided servers can't be destroyed
        .then(servers => {
            if (servers.length) {
                console.log("Destroying servers", servers)
            }

            servers.forEach(async server => {
                let isEmpty = true

                try {
                    const serverInfo = server.ip.split(":")

                    const gameState = await Gamedig.query({
                        type: "cod",
                        host: serverInfo[0],
                        port: serverInfo[1],
                    })

                    isEmpty = gameState.players.length === 0
                } catch (e) {
                    console.log("Error querying server", e)
                }

                if (!isEmpty) {
                    return
                }

                const match = await server.getMatch()

                match.cancel(Match.REMOVAL_REASONS.ENDED)
            })
        })
}

const cancelNonStartedInactiveMatches = () => {
    Match.getRecentMatchesQuery()
        .whereNull("deleted_reason") // Not already canceled
        .whereNull("scheduled_at") // Non scheduled match
        .whereNull("server_id") // The match did not start
        .where(
            "last_activity_at",
            "<",
            moment()
                .subtract("15", "minutes")
                .format("YYYY-MM-DD HH:mm:ss"),
        )
        .then(matches => {
            if (matches.length) {
                console.log("Canceling matches INACTIVITY", matches)
            }

            matches.forEach(async match => {
                match.cancel(Match.REMOVAL_REASONS.INACTIVITY)
            })
        })
}

const cancelNotFullFilledScheduledMatches = () => {
    console.log("Calling: cancelNotFullFilledScheduledMatches")
    console.log(Match.getFullMatchById(1))
    Match.query()
        .eager("players")
        .whereNull("deleted_reason") // Not already canceled
        .whereNotNull("scheduled_at") // Scheduled match
        .whereNull("server_id")
        .where("scheduled_at", "<", moment().format("YYYY-MM-DD HH:mm:ss"))
        .then(matches => {
            matches.forEach(match => {
                if (match.isFull()) {
                    console.log(
                        "Preventing scheduled match from being cancelled: Match is full",
                        match,
                    )

                    return
                }

                console.log(
                    "Canceling match SCHEDULED_MATCH_NOT_FULLFILLED",
                    match,
                )

                match.cancel(
                    Match.REMOVAL_REASONS.SCHEDULED_MATCH_NOT_FULLFILLED,
                )
            })
        })
}

const logUsersActivity = async () => {
    const onlineUsers = await bot.getClient().users.filter(user => {
        return user.bot === false && user.presence.status !== "offline"
    })

    onlineUsers.forEach(async user => {
        const currentUser = await User.upsertByDiscordId(user.id, user)

        await LogUserActivity.query().insert({
            id: currentUser.id,
            game: user.presence.game ? user.presence.game.name : null,
            username: user.username,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
    })
}

// Log Users Activity query
const processActivity = async () => {
    const activity = await LogUserActivity.query()

    const groupedActivity = _.groupBy(activity, (item: LogUserActivity) => {
        return moment(item.createdAt).format("YYYY-MM-DD HH:00:00")
    })

    _.each(groupedActivity, async (items: Array<LogUserActivity>, date) => {
        const onlinePlaying = _.uniq(
            items.filter(item => item.game).map(item => item.id),
        )

        const justOnline = _.uniq(
            items.filter(item => !item.game).map(item => item.id),
        )

        try {
            const successInsert = await LogProcessedActivity.query().insert({
                online: justOnline.join(","),
                playing: onlinePlaying.join(","),
                online_at: date,
            })

            if (successInsert) {
                await LogUserActivity.query().delete()
            }
        } catch (e) {
            console.log(
                "Something went wrong when inserting processed log.",
                e.stack,
            )
        }
    })
}

export default {
    init,
}
