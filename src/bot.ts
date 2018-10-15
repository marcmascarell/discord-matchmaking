import LogCommand from "./Models/LogCommand"

const Commando = require("discord.js-commando")
const path = require("path")
import secrets from "./secrets"
import utils from "./Utilities/utils"
import { Channel, Guild, GuildChannel, TextChannel } from "discord.js"
import { setInterval } from "timers"

let isReady = false

const client = new Commando.Client({
    owner: secrets.discordOwner,
    unknownCommandResponse: utils.isDevelopment(),
})

const getClient = () => client

const whenReady = (): Promise<void> => {
    return new Promise(resolve => {
        setInterval(() => {
            if (!isReady) {
                return
            }

            resolve()
        }, 20)
    })
}

const init = (): Promise<void> => {
    if (secrets.logCommands) {
        client.on("commandRun", async (command, promise, message, args) => {
            await LogCommand.query().insert({
                command: `${command.groupID}:${command.name} ${args.command ||
                    ""}`,
                discord_username: message.message.author.username,
                discord_user_id: message.message.author.id,
                discord_guild:
                    message.message.channel.type === "dm"
                        ? "DM"
                        : message.message.channel.guild.id,
            })
        })
    }

    client.on("ready", async () => {
        console.log("BOT is ready.")
        isReady = true

        client.user.setActivity("!help", { type: "LISTENING" })

        client.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: true,
            })
            // Registers all built-in groups, commands, and argument types
            // .registerDefaults()

            // Registers your custom command groups
            .registerGroups([
                ["match", "Matchmaking commands"],
                ["misc", "Other useful commands"],
                // ['some', 'Some group'],
                // ['other', 'Some other group']
            ])

            .registerTypesIn(path.join(__dirname, "Types"))

            // Registers all of your commands in the ./commands/ directory
            .registerCommandsIn(path.join(__dirname, "Commands/misc"))
            .registerCommandsIn(path.join(__dirname, "Commands/match"))

        // Create an event listener for new guild members
        client.on("guildMemberAdd", member => {
            // Send the message to a designated channel on a server:
            const channel: any = member.guild.channels.find("name", "general")

            // Do nothing if the channel wasn't found on this server
            if (!channel) return

            // Send the message, mentioning the member
            channel.send(
                `Welcome **${member}** to the **COD1 Community**! Stay tuned for future events.\n_Use \`!help\` to see what can I do for you._`,
                {
                    files: [
                        "https://cdn.discordapp.com/attachments/438725577831219210/484395447939629086/make-cod-great-again.jpg",
                    ],
                },
            )
        })
    })

    client.login(secrets.discordToken)

    return whenReady()
}

const getGuildById = async (guildId): Promise<Guild> => {
    return getClient().guilds.find(guild => guild.id === guildId)
}

const getChannel = async (
    guildName,
    channelName,
): Promise<TextChannel | GuildChannel | any> => {
    const guild: Guild = await getClient().guilds.find(
        guild => guild.name === guildName,
    )

    if (!guild) return null

    return await guild.channels.find(channel => channel.name === channelName)
}

const getChannelById = async (
    guildId,
    channelId,
): Promise<TextChannel | GuildChannel | any> => {
    const guild: Guild = await getClient().guilds.find(
        guild => guild.id === guildId,
    )

    if (!guild) return null

    return await guild.channels.find(channel => channel.id === channelId)
}

const getCategoryByName = (guild, name) => {
    return guild.channels
        .filter(channel => channel.type === "category")
        .find(channel => channel.name === name)
}

export default {
    init,
    getClient,
    getChannel,
    getChannelById,
    getCategoryByName,
    getGuildById,
    whenReady,
}
