import {Command, CommandInfo, CommandoClient} from "discord.js-commando"

import {GuildResolvable} from "discord.js"
import utils from '../Utilities/utils'

export default abstract class GuildCommand extends Command {

    public guildOnly: boolean = true;

    isEnabledIn(guild : GuildResolvable) {
        const isGuildOnlyDev = utils.isGuildOnlyDev(guild)

        return (
            utils.isDevelopment() && isGuildOnlyDev ||
            utils.isProduction() && ! isGuildOnlyDev
        )
    }

};
