
exports.up = function(knex, Promise) {
    return knex.schema.createTable('log_processed_activity', function(table) {
        table.string('online').nullable();
        table.string('playing').nullable();

        table.dateTime('online_at').notNull();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('log_processed_activity');
};
