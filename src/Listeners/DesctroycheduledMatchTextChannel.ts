import Listener from "./Listener"
import MatchCard from "../Embeds/MatchCard"
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

        const channel = await discordUtils.getScheduledTextChannel(match)
        channel.delete("This channel has been terminated")
    }
}
