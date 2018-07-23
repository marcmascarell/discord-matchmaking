
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').unsigned().primary();

        table.string('discord_id').notNullable();
        table.string('discord_discriminator').notNull();
        table.string('discord_username').notNull();
        table.string('discord_avatar').nullable();

        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
