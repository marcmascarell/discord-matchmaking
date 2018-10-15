import Model from "./BaseModel"

export default class LogCommand extends Model {
    public id: string // Discord ids are strings
    public command: string
    public discord_username: string
    public discord_user_id: string
    public discord_guild: string

    static get tableName() {
        return "log_commands"
    }
}
