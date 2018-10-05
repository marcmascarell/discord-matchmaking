import { CommandMessage, CommandoClient } from "discord.js-commando"
import Match from "../../Models/Match"

import MapType from "../../Types/MapArgumentType"
import BaseCommand from "../BaseCommand"
import moment from "moment"

export default class ScheduledMatchCommand extends BaseCommand {
    constructor(client: CommandoClient) {
        super(client, {
            name: "scheduled-match",
            memberName: "scheduled-match",
            description:
                "Organize a scheduled match to be played in a near future.",
            group: "match",
            guildOnly: true,
            aliases: ["future-match"],
            args: [
                {
                    key: "datetime",
                    label: "Date & time",
                    prompt:
                        'Date and time? (Central European Time). Examples: "12-20-2018 21:00" (MM-DD-YYYY hh:mm), "19:30" (later today)',
                    type: "string",
                    wait: 30,
                    validate: text => {
                        const datetime = ScheduledMatchCommand.getDateTimeFromString(
                            text,
                        )

                        if (!datetime) {
                            return false
                        }

                        const isFutureDate = moment().diff(datetime) < 0

                        if (!isFutureDate) {
                            return "The date must be someday or time in the future"
                        }

                        return true
                    },
                },
                {
                    key: "players",
                    label: "Players",
                    prompt: "How many players? (5 or 5v5 or 5vs5 ... NvsN)",
                    type: "match-players",
                    wait: 15,
                },
                {
                    key: "map",
                    label: "map to play",
                    prompt: "Map? Random/" + MapType.maps.join("/"),
                    type: "map",
                    default: "random",
                },
            ],
        })
    }

    static getDateTimeFromString(string: string): moment.Moment | void {
        const datetime = moment(string, "MM-DD-YYYY HH:mm", true)

        if (datetime.isValid()) {
            return datetime
        }

        const todayTime = moment(string, "HH:mm", true)

        if (todayTime.isValid()) {
            return todayTime
        }

        return null
    }

    async run(
        message: CommandMessage,
        {
            datetime,
            players,
            map,
        }: { datetime: string; players: string; map: string },
    ) {
        const player = message.author
        const channel = message.channel
        const matchesWaitingForPlayers = await Match.getWaitingForPlayers()
        const playerInMatch = Match.isPlayerInMatches(
            matchesWaitingForPlayers,
            player,
        )

        if (playerInMatch) {
            return message.reply(
                "You are already in a match (" +
                    playerInMatch.id +
                    ")! To leave write `!leave` to leave or `!list` to see all matches",
            )
        }

        if (!map || map.toLowerCase() === "random") {
            map = MapType.getRandom()
        }

        const match = await Match.create(
            {
                channel,
                maxPlayers: parseInt(players) * 2,
                maps: map,
                creator_id: player.id,
                scheduled_at: ScheduledMatchCommand.getDateTimeFromString(
                    datetime,
                ),
            },
            player,
        )

        if (!match) {
            return message.reply(
                `Could not create the match... Please, contact an admin`,
            )
        }

        // The match creation will be notified with a RichEmbed
        return null
    }
}
