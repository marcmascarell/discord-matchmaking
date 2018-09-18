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

const createVoiceChannel = async (guild, category, userLimit, name) => {
    const voiceChannels = guild.channels.filter(channel => channel.type === 'voice')

    const voiceChannel = <VoiceChannel> voiceChannels.first()

    const newChannel = await voiceChannel.clone(name)
    newChannel.setParent(category)

    newChannel.edit({
        userLimit
    })

    newChannel.createInvite().then(invite => {
        console.log('invite', invite)
    })
}

export default {
    createCategory,
    createVoiceChannel,
    isDevelopmentGuild,
}
