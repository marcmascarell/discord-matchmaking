import Listener from './Listener'
import ServerCreated from '../Events/ServerCreated'
import gameServerManager from '../Server/gameServerManager'
import ServerLimitReached from '../Errors/ServerLimitReached'
import Match from "../Models/Match"
import firestore from "../firestore"

export default class CreateMatchServer extends Listener {

	handle({match} : {match: Match}) {
        const channel = match.getChannel()
        const serverName = match.getServerName()

        console.log(`Creating server for match #${match.id}...`)

        gameServerManager
            .create(serverName, {
                id: match.id,
                maps: match.maps.split(','),
                slots: match.maxPlayers + 2,
            })
            .then(() => {
                const gameServersCollection = firestore
                    .getClient()
                    .collection('gameservers')

                gameServersCollection
                    .where('name', '==', serverName) // server name allows us to distinguish between dev/prod
                    .where('status', '==', 'online')
                    .onSnapshot(async docSnapshot => {
                        if (!docSnapshot.empty) {
                            const server = docSnapshot.docs[0].data()
                            const createdServer = await match.setServer(server)

                            console.log('createdServer', createdServer)

                            await Match
                                .query()
                                .update({
                                    server_id: createdServer.id
                                })
                                .where('id', match.id)

                            const matchWithServer = await Match.getFullMatchById(match.id)

                            new ServerCreated({
                                match: matchWithServer
                            })
                        }

                    }, err => {
                        console.log(`Encountered error: ${err}`);
                    });
            })
            .catch(e => {
                console.log('Error server creation', e)
                if (e instanceof ServerLimitReached) {
                    channel.send(`Unable to create a server for match ${match.id}. Server limit reached.`)
                } else {
                    channel.send(`Unable to create a server for match ${match.id} :(`)
                }
            })
	}

}
