import { RichEmbed } from "discord.js"
import utils from "../Utilities/utils"
import MapType from "../Types/MapArgumentType"
const _ = require("lodash")

const Discord = require("discord.js")

export default class ServerStatusCard {
    private serverStatus: any

    constructor(serverStatus: any) {
        this.serverStatus = serverStatus

        return this
    }

    render(): RichEmbed {
        let footer = ""
        const playersSortedByFrags = _.sortBy(
            this.serverStatus.players,
            "frags",
        ).reverse()

        const mapImage = MapType.getMapImage(this.serverStatus.map)

        let embed = new Discord.RichEmbed()
            .setTitle(
                `${utils.prettifyMapName(this.serverStatus.map)} (${
                    this.serverStatus.players.length
                }/${this.serverStatus.maxplayers}) - ${this.serverStatus.name}`,
            )
            .setColor("#9B59B6")

        if (this.serverStatus.customFields.recommended) {
            footer = "Recommended public server"
        }

        if (this.serverStatus.customFields.mods) {
            footer += this.serverStatus.customFields.mods ? ` * Modded` : ""
        }

        if (footer !== "") {
            embed.setFooter(footer.trim())
        }

        if (playersSortedByFrags.length) {
            embed.addField(
                "Players",
                _.map(playersSortedByFrags, player => {
                    return `${player.name.trim()} *(${player.frags})*`
                }).join("\n"),
            )
        }

        embed.addField(
            "Address",
            "`/connect " +
                `${this.serverStatus.query.host}:${
                    this.serverStatus.query.port
                }` +
                "`",
        )

        if (mapImage) {
            embed.setThumbnail(mapImage)
        }

        return embed
    }
}
