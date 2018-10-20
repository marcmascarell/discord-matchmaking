import { RichEmbed } from "discord.js"
import Match from "../Models/Match"
import utils from "../Utilities/utils"
import moment from "moment"

const Discord = require("discord.js")

export default class MinimalMatchCard {
    private matches: any
    private embed: RichEmbed

    constructor(matches: any, embed: RichEmbed | null) {
        this.matches = matches
        this.embed = embed || new Discord.RichEmbed()

        return this
    }

    render(): RichEmbed {
        this.embed.setColor("#9B59B6")

        let count = 0
        this.matches
            .sort((a: Match, b: Match) => {
                let aDate = a.scheduledAt ? a.scheduledAt : a.createdAt
                let bDate = b.scheduledAt ? b.scheduledAt : b.createdAt

                return moment(aDate).isAfter(bDate)
            })
            .forEach(match => {
                const playersPerTeam = match.playersPerTeam()
                const firstMap: string = match.mapNames()[0]

                if (count > 0) {
                    this.embed.addField(
                        "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁",
                        "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
                    )
                }

                this.embed.addField(
                    `${
                        match.scheduledAt ? "📅 SCHEDULED:" : ":fire: NOW:"
                    } ${playersPerTeam}vs${playersPerTeam} on ${firstMap}  (${
                        match.players.length
                    }/${match.maxPlayers})`,
                    match.playerNames().join(", "),
                )
                this.embed.addField(`Join command`, "`!join " + match.id + "`")

                if (match.scheduledAt) {
                    this.embed.addField(
                        `Scheduled for`,
                        `${utils.getHumanSpecificFormattedDate(
                            match.scheduledAt,
                        )}`,
                    )
                }

                count++
            })

        return this.embed
    }
}
