import Listener from './Listener'
import gameServerManager from '../Server/gameServerManager'
import Match from "../Models/Match"
import Server from "../Models/Server"

export default class DestroyMatchServer extends Listener {

	async handle({match} : {match: Match}) {
		await Server.destroy(match)
	}

}
