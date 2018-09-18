import {Guild, GuildResolvable, VoiceChannel} from "discord.js";
import secrets from "../secrets";
import utils from "./utils";

const isDevelopmentGuild = (guild : GuildResolvable) => {
    const id = guild instanceof Guild ? guild.id : guild

    return utils.includes(secrets.guilds.development, id)
}

const createCategory = async (guild, name) => {
    const category = await guild.channels
        .filter(channel => channel.type === 'category')
        .find(channel => channel.name === name)

    if (category) {
        return category
    }

    return guild.channels
        .filter(channel => channel.type === 'category')
        .first()
        .clone(name)
}

const createChannel = async (guild, name, options : {
    category: string|null,
    userLimit: number|null,
    type: string|null
}) => {
    options = Object.assign({}, {
        category: null,
        userLimit: null,
        type: 'text'
    }, options)

    const voiceChannels = guild.channels.filter(channel => channel.type === options.type)

    const voiceChannel = <VoiceChannel> voiceChannels.first()

    const newChannel = await voiceChannel.clone(name)

    if (options.category) {
        newChannel.setParent(options.category)
    }

    if (options.userLimit) {
        newChannel.edit({
            userLimit: options.userLimit
        })
    }

    newChannel.createInvite().then(invite => {
        console.log('invite', invite)
    })
}

const createTextChannel = async (guild, name, options : {category, userLimit}) => {
    createChannel(guild, name, {
        ...options,
        type: 'text'
    })
}

const createVoiceChannel = async (guild, name, options : {category, userLimit}) => {
    createChannel(guild, name, {
        ...options,
        type: 'voice'
    })
}

export default {
    createCategory,
    createVoiceChannel,
    createTextChannel,
    isDevelopmentGuild,
}
