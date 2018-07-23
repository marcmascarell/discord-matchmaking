
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.string('id').notNullable().primary();

        table.string('username').notNull();
        table.string('discriminator').notNull();
        table.string('avatar').nullable();

        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
