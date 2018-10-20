import Match from "../Models/Match"
import { DMChannel, GroupDMChannel, TextChannel } from "discord.js"

import FullMatchCard from "../Embeds/FullMatchCard"
import MinimalServersStatusCard from "../Embeds/MinimalServersStatusCard"
import MinimalMatchCard from "../Embeds/MinimalMatchCard"
const _ = require("lodash")
const Discord = require("discord.js")

// Todo: Convert to ListMatches
export default class ListPendingMatches {
    constructor(
        channel: TextChannel | DMChannel | GroupDMChannel,
        matches: Match[],
    ) {
        const titleEmbed = new Discord.RichEmbed()
        //
        if (matches.length === 1) {
            titleEmbed.setTitle(`${matches.length} Match`)
        } else {
            titleEmbed.setTitle(`${matches.length} Matches`)
        }

        titleEmbed.setDescription("Waiting for players")

        channel.send(titleEmbed)

        channel.send(new MinimalMatchCard(matches).render())
    }
}
