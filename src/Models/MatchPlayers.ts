import Model from "./BaseModel"

export default class MatchPlayers extends Model {
    public match_id
    public user_id

    static get tableName() {
        return "match_players"
    }

    static get idColumn() {
        return ["match_id", "user_id"]
    }
}
