import Model from './BaseModel'

export default class User extends Model {
    public id: number
    public discord_id: string // Discord ids are strings
    public discord_username: string
    public discord_discriminator: string
    public discord_avatar: string

    public discordId: string
    public discordUsername: string
    public discordDiscriminator: string
    public discordAvatar: string

    static get virtualAttributes() {
        return ['username']
    }

    get username() {
        return this.discordUsername
    }

    static get tableName() {
        return 'users';
    }
}
