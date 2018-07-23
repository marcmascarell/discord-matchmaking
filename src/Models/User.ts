import Model from './BaseModel'

export default class User extends Model {
    public id: string // Discord ids are strings
    public username: string
    public discriminator: string
    public avatar: string

    static get tableName() {
        return 'users';
    }
}
