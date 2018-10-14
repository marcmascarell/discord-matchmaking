import Task from "./Task"
import Match from "../Models/Match"
import Server from "../Models/Server"
import scheduler from "node-schedule"
import moment from "moment"

export default class PrepareScheduledMatchesServers extends Task {
    private async handle(match: Match) {
        Server.createForMatch(match)
    }

    dispatch(match: Match) {
        if (!match.isFull()) {
            console.log(
                `Scheduled Match ${match.id} (${moment(
                    match.scheduledAt,
                ).format(
                    "YYYY-MM-DD HH:mm:ss",
                )}) server creation prevented: Match is not full (${
                    match.players.length
                }/${match.maxPlayers})`,
            )
            return
        }

        if (match.hasServerAssigned()) {
            console.log(
                `Scheduled Match ${match.id} (${moment(
                    match.scheduledAt,
                ).format(
                    "YYYY-MM-DD HH:mm:ss",
                )}) server creation prevented: Match already has a server assigned`,
            )
            return
        }

        this.handle(match)
    }

    autoSchedule() {
        Match.query()
            .whereNull("deleted_reason") // Not already canceled
            .whereNull("server_id")
            .whereNotNull("scheduled_at")
            .then(matches => {
                if (!matches.length) {
                    return
                }

                matches.forEach(match => this.scheduleTaskForMatch(match))
            })
    }

    scheduleTaskForMatch(match) {
        const scheduledAt = moment(match.scheduledAt)
        const minutesBeforeMatch = scheduledAt.clone().subtract(10, "minutes")

        console.log(
            `Scheduling scheduled match (#${
                match.id
            }) preparation for ${minutesBeforeMatch.format(
                "YYYY-MM-DD HH:mm:ss",
            )}`,
        )

        scheduler.scheduleJob(
            {
                start: minutesBeforeMatch.toDate(),
                end: scheduledAt.toDate(),
                rule: "0 */1 * * * *",
            },
            async () => {
                const scheduledMatch = await Match.query()
                    .eager("players")
                    .findById(match.id)

                this.dispatch(scheduledMatch)
            },
        )
    }
}
