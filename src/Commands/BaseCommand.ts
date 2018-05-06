import {Command} from "discord.js-commando"

import {GuildResolvable} from "discord.js"
import utils from '../Utilities/utils'

export default class BaseCommand extends Command {

    isEnabledIn(guild : GuildResolvable) {
        const isGuildOnlyDev = utils.isGuildOnlyDev(guild)

        return (
            utils.isDevelopment() && isGuildOnlyDev ||
            utils.isProduction() && ! isGuildOnlyDev
        )
    }

};
