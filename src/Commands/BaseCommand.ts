import { Command } from "discord.js-commando"
import utils from "../Utilities/utils"
import { GuildResolvable } from "discord.js"

export default abstract class BaseCommand extends Command {
    // Will disable production bot commands while we are developing
    // isEnabledIn(guild : GuildResolvable) {
    //     return !(utils.isDevelopmentGuild(guild) && utils.isProduction())
    // }
}
