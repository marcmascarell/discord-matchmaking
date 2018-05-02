const Model = require('./BaseModel');

class MatchPlayers extends Model {
    static get tableName() {
        return 'match_players';
    }

    static get idColumn() {
        return ['match_id', 'user_id'];
    }
}

module.exports = MatchPlayers;
