const moment = require('moment');
import Model from './BaseModel'
import Match from './Match'
import User from './User'
import gameServerManager from '../Server/gameServerManager'

export default class Server extends Model {
    public id: number
    public status: string
    public destroyed_at: string
    public serverIP: string
    public password: string
    public name: string
    public ip: string
    public user_id: number
    public rcon: string
    public slots: number
    public creation_request_at: string
    public destroy_at: string
    public provisioned_at: string

    static get tableName() {
        return 'servers';
    }

    static relationMappings() {
        return {
            providedBy: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'servers.user_id',
                    to: 'users.id'
                }
            }
        }
    }

    static async destroy(match : Match) {
        if (! match) {
            console.log('Unable to destroy server, match not found for server', match.id)

            return
        }

        return gameServerManager
            .destroy(match)
            .then(() => {
                return Server
                        .query()
                        .where('id', match.server.id)
                        .update({
                            destroyed_at: moment().format('YYYY-MM-DD HH:mm:ss')
                        })
            })
            .catch((e : Error) => {
                console.log(e.stack)
            })
    }

    getMatch() {
        return Match.query()
            .eager('[server.providedBy]')
            .findOne('server_id', this.id)
    }
}
