import Model from "./BaseModel"

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
        return ["username"]
    }

    username(): string {
        return this.discordUsername
    }

    static get tableName() {
        return "users"
    }

    static findByDiscordId(id: string): any {
        return User.query().findOne({
            discord_id: id,
        })
    }

    static async upsertByDiscordId(
        id: string,
        user: {
            id: string
            username: string
            discriminator: string
            avatar: string
        },
    ): Promise<User> {
        const foundUser = await User.query().findOne({ discord_id: user.id })

        return await User.query().upsertGraph(
            {
                id: foundUser ? foundUser.id : null,
                discord_id: user.id,
                discord_username: user.username,
                discord_discriminator: user.discriminator,
                discord_avatar: user.avatar,
            },
            {
                insertMissing: true,
                noDelete: true,
            },
        )
    }
}
