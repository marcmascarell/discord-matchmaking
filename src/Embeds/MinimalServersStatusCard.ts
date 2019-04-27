import { RichEmbed } from "discord.js"
import utils from "../Utilities/utils"
import MapType from "../Types/MapArgumentType"
const _ = require("lodash")

const Discord = require("discord.js")

export default class MinimalServersStatusCard {
    private serversStatus: any

    constructor(serversStatus: any) {
        this.serversStatus = serversStatus

        return this
    }

    static getServerNameIcon(server): string {
        return server.players.length ? "🔹" : "🔸"
    }

    render(): RichEmbed {
        let embed = new Discord.RichEmbed()
            .setTitle("💠 Public servers")
            .setDescription("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀")
            .setColor("#9B59B6")

        // Save original array index so we can know which id corresponds
        this.serversStatus.forEach(server => {
            server.id = utils.findServerIndex(server) + 1
        })

        const sortedServers = _.sortBy(this.serversStatus, "players").reverse()

        sortedServers.forEach(server => {
            let footer = ""

            if (server.customFields.recommended) {
                footer = "**Recommended public server**"
            }

            if (server.customFields.mods) {
                footer += server.customFields.mods ? ` * Modded` : ""
            }

            embed.addField(
                `${MinimalServersStatusCard.getServerNameIcon(
                    server,
                )} ${utils.prettifyMapName(server.map)} (${
                    server.players.length
                }/${server.maxplayers}) - ${server.name}`,
                `${server.query.host}:${
                    server.query.port
                } - ${footer.trim()} - _More info \`!pub ${server.id}\`_`,
            )
        })

        return embed
    }
}
