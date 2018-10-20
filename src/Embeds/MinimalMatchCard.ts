import { RichEmbed } from "discord.js"
import Match from "../Models/Match"
import MapType from "../Types/MapArgumentType"
import utils from "../Utilities/utils"

const Discord = require("discord.js")

export default class MinimalMatchCard {
    private matches: any

    constructor(matches: any) {
        this.matches = matches

        return this
    }

    render(): RichEmbed {
        const embed = new Discord.RichEmbed().setColor("#9B59B6")

        let count = 0
        this.matches.forEach(match => {
            const playersPerTeam = match.playersPerTeam()
            const firstMap: string = match.mapNames()[0]

            if (count > 0) {
                embed.addField("▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀")
            }

            embed.addField(
                `${
                    match.scheduledAt ? "📅 SCHEDULED:" : ":fire: NOW:"
                } ${playersPerTeam}vs${playersPerTeam} on ${firstMap}  (${
                    match.players.length
                }/${match.maxPlayers})`,
                match.playerNames().join(", "),
            )
            embed.addField(`Join command`, "`!join " + match.id + "`")

            if (match.scheduledAt) {
                embed.addField(
                    `Scheduled for`,
                    `${utils.getHumanSpecificFormattedDate(match.scheduledAt)}`,
                )
            }

            count++
        })

        return embed
    }
}
