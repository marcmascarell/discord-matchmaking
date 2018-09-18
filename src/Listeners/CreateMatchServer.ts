import Listener from './Listener'
import ServerCreated from '../Events/ServerCreated'
import gameServerManager from '../Server/gameServerManager'
import ServerLimitReached from '../Errors/ServerLimitReached'
import Match from "../Models/Match"
import firestore from "../firestore"
import Server from "../Models/Server";
import moment from "moment";

export default class CreateMatchServer extends Listener {

	async handle({match} : {match: Match}) {
        const channel = match.getChannel()
        const serverName = match.getServerName()

        console.log(`Creating server for match #${match.id}...`)

        const server = await Server
            .query()
            .insertGraph({
                name: serverName,
                creation_request_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: Server.STATUS_CREATING,
            })

        await Match
            .query()
            .update({
                server_id: server.id
            })
            .where('id', match.id)

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

                            const createdServer = await Server
                                .query()
                                .update({
                                    ip: server.ip,
                                    password: server.password,
                                    rcon: server.rcon,
                                    slots: server.slots,
                                    provisioned_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    status: Server.STATUS_CREATED,
                                    destroy_at: moment().add('1', 'hour').add('15', 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                                })
                                .where('id', server.id)

                            console.log('createdServer', createdServer)

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
