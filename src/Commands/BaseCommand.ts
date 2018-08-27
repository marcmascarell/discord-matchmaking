import {Command} from "discord.js-commando"
import utils from "../Utilities/utils";
import {GuildResolvable} from "discord.js";


export default abstract class BaseCommand extends Command {

    // Will disable production bot commands while we are developing
    isEnabledIn(guild : GuildResolvable) {
        const isGuildOnlyDev = utils.isGuildOnlyDev(guild)

        return (
            utils.isDevelopment() && isGuildOnlyDev ||
            utils.isProduction() && ! isGuildOnlyDev
        )
    }

};
