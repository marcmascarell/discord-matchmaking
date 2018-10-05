exports.up = function(knex, Promise) {
    return knex.schema.createTable("log_users_activity", function(table) {
        table.integer("id").notNullable()

        table.string("username").notNull()
        table.string("game").nullable()

        table.dateTime("created_at").nullable()
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("log_users_activity")
}
