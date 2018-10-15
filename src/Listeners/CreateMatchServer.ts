import Listener from "./Listener"
import Match from "../Models/Match"
import Server from "../Models/Server"
import ServerLimitReached from "../Errors/ServerLimitReached"

export default class CreateMatchServer extends Listener {
    async handle({ match }: { match: Match }) {
        Server.createForMatch(match).catch(async e => {
            const channel = await match.getChannel()

            if (e instanceof ServerLimitReached) {
                return channel.send(
                    `Unable to create a server for match ${
                        match.id
                    }. Server limit reached.`,
                )
            }

            channel.send(`Unable to create a server for match ${match.id} :(`)
        })
    }
}
