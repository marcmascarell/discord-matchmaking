
exports.up = function(knex, Promise) {
    return knex.schema.createTable('matches', function(table) {
        table.increments('id').unsigned().primary();

        table.string('maps').notNull();

        table.integer('max_players').notNull();

        table.integer('creator_id').references('users.id');

        table.integer('server_id').references('servers.id').nullable();

        table.string('name').nullable(); // We can't not update name until we have the match `id`

        table.string('guild_id'); // Discord's Guild where the `channel_id` is
        table.string('channel_id'); // Discord's Text Channel where the match originated

        table.string('canceled_reason').nullable();

        table.timestamps();

        // Players joined
        table.dateTime('last_activity_at').nullable();

        table.dateTime('scheduled_at').nullable();

        table.dateTime('deleted_at').nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('matches');
};
