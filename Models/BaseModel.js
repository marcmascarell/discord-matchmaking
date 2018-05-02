const _ = require('lodash');
const { Model } = require('objection');

class BaseModel extends Model {
    $beforeInsert() {
        this.created_at = new Date().format('YYYY-MM-DD HH:mm:ss');
    }

    $beforeUpdate() {
        this.updated_at = new Date().format('YYYY-MM-DD HH:mm:ss');
    }

    $formatDatabaseJson(json) {
        json = super.$formatDatabaseJson(json);

        return _.mapKeys(json, function (value, key) {
            return _.snakeCase(key);
        });
    }

    $parseDatabaseJson(json) {
        json = _.mapKeys(json, function (value, key) {
            return _.camelCase(key);
        });

        return super.$parseDatabaseJson(json);
    }
}

module.exports = BaseModel;
