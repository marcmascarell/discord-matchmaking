import {Model} from "objection"

const _ = require('lodash');
const moment = require('moment');

export default class BaseModel extends Model {
    public created_at: string
    public updated_at: string

    $beforeInsert()
    {
        this.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    $beforeUpdate()
    {
        this.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    $formatDatabaseJson(json : any)
    {
        json = super.$formatDatabaseJson(json);

        return _.mapKeys(json, function (_value : null, key : string) {
            return _.snakeCase(key);
        });
    }

    $parseDatabaseJson(json : any)
    {
        json = _.mapKeys(json, function (_value : null, key : string) {
            return _.camelCase(key);
        });

        return super.$parseDatabaseJson(json);
    }
}
