import Listener from "./Listener"
const Discord = require("discord.js")

export default class NotifyStreams extends Listener {
    handle(channel, streams, title = `🔴 Currently streaming`) {
        const embed = new Discord.RichEmbed()
            .setTitle(title)
            .setDescription("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀")
            .setColor("#4b367c")

        streams.forEach(stream => {
            const username = stream.thumbnail_url
                .replace(
                    "https://static-cdn.jtvnw.net/previews-ttv/live_user_",
                    "",
                )
                .replace("-{width}x{height}.jpg", "")

            embed.addField(
                `https://www.twitch.tv/${username}`,
                `${stream.title}`,
            )
        })

        channel.send(embed)
    }
}
