import {RichEmbed} from "discord.js"
import Match from "../Models/Match"
import MapType from "../Types/MapArgumentType"
import utils from "../Utilities/utils"

const Discord = require('discord.js');

export default class MatchCard {
    private match : Match

    constructor(match : Match) {
        this.match = match

        return this
    }

    render() : RichEmbed {
        const match = this.match
        const embed = new Discord.RichEmbed().setColor('#9B59B6');
        const playersPerTeam = match.playersPerTeam()
        const firstMap : string = match.mapNames()[0]

        const mapImage = MapType.getMapImage(firstMap)

        if (mapImage) {
            embed.setThumbnail(mapImage)
        }

        if (match.isFull()) {
            embed.addField(
                `${playersPerTeam}vs${playersPerTeam} on ${firstMap}`,
                match.playerNames().join(', ')
            )
        } else {
            embed.addField(
                `${playersPerTeam}vs${playersPerTeam} on ${firstMap} (${match.players.length}/${match.maxPlayers})`,
                match.playerNames().join(', ')
            )

            embed.addField(`Join command`, '`!join '+ match.id +'`')
        }

        if (match.scheduledAt) {
            embed.addField(`Scheduled for`, `${utils.getHumanSpecificFormattedDate(match.scheduledAt)}`)
        }
        // embed.setFooter(`Created ` + match.createdAt.fromNow())

        return embed
    }
};
