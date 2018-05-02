const MatchCard = require('../Embeds/MatchCard')

module.exports = class AnnounceNewMatch {
    constructor(channel, match) {
        const embed = new MatchCard(match)

        embed.setTitle('New match created')
             .setColor('#00b5b6')

        channel.send(embed)
    }
};
