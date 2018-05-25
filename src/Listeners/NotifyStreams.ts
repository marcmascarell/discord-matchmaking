import Listener from './Listener'
const Discord = require('discord.js');

export default class NotifyStreams extends Listener {

	handle(channel, streams, title = `**Currently streaming**`) {
        let embedTitle = new Discord.RichEmbed()
            .setTitle(title)
            .setColor('#4b367c');

        channel.send(embedTitle)

        streams.forEach(stream => {
            let embed = new Discord.RichEmbed().setColor('#4b367c');

            const username = stream.thumbnail_url
                .replace('https://static-cdn.jtvnw.net/previews-ttv/live_user_', '')
                .replace('-{width}x{height}.jpg', '')

            embed.setTitle(`https://www.twitch.tv/${username}`)
            embed.setFooter(`${stream.title}`)

            channel.send(embed)
        })
    }

}
