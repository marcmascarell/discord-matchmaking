import { ArgumentType, CommandoClient } from "discord.js-commando"

export default class MatchPlayersArgumentType extends ArgumentType {
    constructor(client: CommandoClient) {
        super(client, "match-players")
    }

    validate(value: string): string | boolean {
        const playersPerTeam: number = parseInt(value)

        if (isNaN(playersPerTeam)) {
            return `Invalid player number. Write it like this: 5 or 5v5 or 5vs5 (NvsN)`
        }

        const maxPlayers = playersPerTeam * 2

        if (playersPerTeam < 2) {
            return `2 players per team is the minmum`
        }

        if (playersPerTeam > 6) {
            return `6 players per team is the maximum`
        }

        if (maxPlayers % 2 !== 0) {
            return `Players must be divisible by 2`
        }

        return true
    }

    parse(value: string): string {
        // This works with 5, 5v5, 5vs5 formats
        return `${parseInt(value[0], 10)}`
    }
}

// Looks like it does not work without this line...
module.exports = MatchPlayersArgumentType
