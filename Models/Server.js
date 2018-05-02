const moment = require('moment');
const Model = require('./BaseModel');
const gameServerManager = require('../Server/gameServerManager');

class Server extends Model {
    static get tableName() {
        return 'servers';
    }

    static relationMappings() {
        const User = require('./User');

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

    async destroy() {
        const match = await this.getMatch()

        if (! match) {
            console.log('Unable to destroy server, match not found for server', this.id)

            return
        }

        return gameServerManager
            .destroy(match)
            .then(() => {
                return Server
                        .query()
                        .where('id', this.id)
                        .update({
                            'destroyed_at': moment().format('YYYY-MM-DD HH:mm:ss')
                        })
            })
            then(() => {
                return match.cancel(match.REMOVAL_REASONS.ENDED)
            })
            .catch(e => {
                console.log(e.stack)
            })
    }

    getMatch() {
        const Match = require('./Match');

        return Match.query().findOne('server_id', this.id)
    }
}

module.exports = Server;
