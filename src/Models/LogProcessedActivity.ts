import Model from './BaseModel'

export default class LogProcessedActivity extends Model {
    public online: string
    public playing: string
    public online_at: string

    static get tableName() {
        return 'log_processed_activity';
    }
}
