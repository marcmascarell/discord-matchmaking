exports.up = function(knex, Promise) {
    return knex.schema.createTable("match_players", function(table) {
        table
            .string("user_id")
            .references("users.id")
            .notNullable()
        table
            .integer("match_id")
            .references("match.id")
            .notNullable()

        table.timestamps()
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("match_players")
}
