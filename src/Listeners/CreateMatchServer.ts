import Listener from './Listener'
import ServerCreated from '../Events/ServerCreated'
import gameServerManager from '../Server/gameServerManager'
import ServerLimitReached from '../Errors/ServerLimitReached'
import Match from "../Models/Match"

export default class CreateMatchServer extends Listener {

	handle({match} : {match: Match}) {
        const channel = match.getChannel()

        gameServerManager
            .create(match)
            .then(() => {
                console.log('Waiting for server')

                const maxRetries = 30 // 5 minutes, normally it takes about 3 minutes but DO has shortages sometimes so we are a bit more patient
                let retries  = 0

                // Wait 1 minute before looking for the server
                setTimeout(() => {
                    const interval = setInterval(() => {
                        match.isServerReady()
                            .then(matchWithServer => {
                                if (matchWithServer) {
                                    new ServerCreated({
                                        match: matchWithServer
                                    })
                                    // console.log('Server ready', matchWithServer)
                                    //
                                    // this.onServerCreated(channel, matchWithServer)

                                    clearInterval(interval)
                                    return
                                }

                                if (retries === maxRetries / 2) {
                                    channel.send(`Waiting server for match ${match.id}... Hold on...`)
                                }

                                if (retries >= maxRetries) {
                                    clearInterval(interval)
                                    throw new Error("Looking for server max retries reached")
                                }

                                retries++
                                console.log('Waiting for server loop...', retries)
                            })
                            .catch(e => {
                                channel.send(`Unable to create a server for match ${match.id} :(`)

                                console.log(e.stack)
                                clearInterval(interval)
                            })
                    }, 10000)
                }, 60000)
            })
            .catch(e => {
                if (e instanceof ServerLimitReached) {
                    channel.send(`Unable to create a server for match ${match.id}. Server limit reached.`)
                } else {
                    channel.send(`Unable to create a server for match ${match.id} :(`)
                }
            })
	}

}
