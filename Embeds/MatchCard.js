const _ = require('lodash');
const Discord = require('discord.js');
const moment = require('moment');
const MapType = require('../types/map');

module.exports = class MatchCard {
    constructor(match) {
        return this.render(match.toJSON())
    }

    render(match) {
        const embed = new Discord.RichEmbed().setColor('#9B59B6');

        const firstMap = _.capitalize(match.mapNames[0])

        const mapImage = MapType.getMapImage(firstMap)

        if (mapImage) {
            embed.setThumbnail(mapImage)
        }

        if (match.isReady) {
            embed.addField(
                `${match.playersPerTeam}vs${match.playersPerTeam} on ${firstMap}`,
                match.playerNames.join(', ')
            )
        } else {
            embed.addField(
                `${match.playersPerTeam}vs${match.playersPerTeam} on ${firstMap} (${match.players.length}/${match.maxPlayers})`,
                match.playerNames.join(', ')
        )

            embed.addField(`Join command`, '`!join '+ match.id +'`')
        }

        // embed.setFooter(`Created ` + match.createdAt.fromNow())

        return embed
    }
};
