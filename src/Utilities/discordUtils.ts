import {
    Guild,
    GuildChannel,
    GuildResolvable,
    TextChannel,
    VoiceChannel,
} from "discord.js"
import secrets from "../secrets"
import utils from "./utils"
import bot from "../bot"

const isDevelopmentGuild = (guild: GuildResolvable) => {
    const id = guild instanceof Guild ? guild.id : guild

    return utils.includes(secrets.guilds.development, id)
}

const createCategory = async (guild, name) => {
    const category = await bot.getCategoryByName(guild, name)

    if (category) {
        return category
    }

    return guild.channels
        .filter(channel => channel.type === "category")
        .first()
        .clone(name)
}

const createChannel = async (
    guild,
    name,
    options: {
        category: string | null
        userLimit: number | null
        type: string | null
    },
): Promise<TextChannel | GuildChannel | any> => {
    options = Object.assign(
        {},
        {
            category: null,
            userLimit: null,
            type: "text",
        },
        options,
    )

    const voiceChannels = guild.channels.filter(
        channel => channel.type === options.type,
    )

    const voiceChannel = <VoiceChannel>voiceChannels.first()

    const newChannel = await voiceChannel.clone(name)

    if (options.category) {
        newChannel.setParent(options.category)
    }

    if (options.userLimit) {
        newChannel.edit({
            userLimit: options.userLimit,
        })
    }

    newChannel.createInvite().then(invite => {
        // console.log('invite', invite)
    })

    return newChannel
}

const createTextChannel = async (
    guild,
    name,
    options: { category; userLimit },
): Promise<TextChannel> => {
    return createChannel(guild, name, {
        ...options,
        type: "text",
    })
}

const createVoiceChannel = async (
    guild,
    name,
    options: { category; userLimit },
): Promise<GuildChannel> => {
    return createChannel(guild, name, {
        ...options,
        type: "voice",
    })
}
const getScheduledTextChannel = async match => {
    const guild = await bot.getGuildById(match.guildId)
    const category = await bot.getCategoryByName(guild, "scheduled-matches")
    return await category.children.find(channel =>
        channel.name.endsWith(`-${match.id}`),
    )
}

export default {
    createCategory,
    createVoiceChannel,
    createTextChannel,
    isDevelopmentGuild,
    getScheduledTextChannel,
}
