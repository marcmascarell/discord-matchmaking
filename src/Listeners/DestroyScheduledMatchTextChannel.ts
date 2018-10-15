import Listener from "./Listener"
import FullMatchCard from "../Embeds/FullMatchCard"
import Match from "../Models/Match"
import discordUtils from "../Utilities/discordUtils"
import { Client } from "discord.js"
import bot from "../bot"
const moment = require("moment")

export default class DestroyScheduledMatchTextChannel extends Listener {
    async handle({ match }: { match: Match }) {
        if (!match.scheduledAt) {
            return
        }

        try {
            const channel = await discordUtils.getScheduledTextChannel(match)

            channel.delete("This channel has been destroyed")
        } catch (e) {
            return console.log(
                `Unable to destroy text channel. Couldn't find scheduled match text channel for: #${
                    match.id
                }`,
            )
        }
    }
}
