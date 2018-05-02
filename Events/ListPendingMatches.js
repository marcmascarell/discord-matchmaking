const MatchCard = require('../Embeds/MatchCard')
const _ = require('lodash');
const Discord = require('discord.js');

module.exports = class ListPendingMatches {
    constructor(channel, matches) {
        const titleEmbed = new Discord.RichEmbed()

        if (matches.length === 1) {
            titleEmbed.setTitle(`${matches.length} Match`)
        } else {
            titleEmbed.setTitle(`${matches.length} Matches`)
        }

        titleEmbed.setDescription('Waiting for players')

        channel.send(titleEmbed)

        _.each(matches, (match) => {
            channel.send(new MatchCard(match))
        })
    }
};
