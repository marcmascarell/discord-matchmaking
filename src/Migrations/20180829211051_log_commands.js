
exports.up = function(knex, Promise) {
    return knex.schema.createTable('log_commands', function(table) {
        table.increments('id').unsigned().primary();

        table.string('command');

        table.string('discord_username');

        table.string('discord_user_id');

        table.string('discord_guild');

        table.dateTime('created_at').nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('log_commands');
};
