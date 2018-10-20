import Match from "../Models/Match"
import { DMChannel, GroupDMChannel, TextChannel } from "discord.js"

import MinimalMatchCard from "../Embeds/MinimalMatchCard"
const _ = require("lodash")
const Discord = require("discord.js")

// Todo: Convert to ListMatches
export default class ListPendingMatches {
    constructor(
        channel: TextChannel | DMChannel | GroupDMChannel,
        matches: Match[],
    ) {
        const title =
            matches.length === 1
                ? `${matches.length} Match`
                : `${matches.length} Matches`

        const embed = new Discord.RichEmbed()
        embed.setTitle(title + " waiting for players")
        embed.setDescription("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀")
        embed.setThumbnail(
            "https://images-ext-2.discordapp.net/external/_F97Sjyd4QGnKB07CQYCcT9tHXkNLB8TFAq2g1ycrW4/https/images.emojiterra.com/twitter/v11/512px/2694.png",
        )

        channel.send(new MinimalMatchCard(matches, embed).render())
    }
}
