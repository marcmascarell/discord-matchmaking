exports.up = function(knex, Promise) {
    return knex.schema.createTable("servers", function(table) {
        table
            .increments("id")
            .unsigned()
            .primary()

        // Will contain the match ID (Useful for a server to provision itself)
        // In case of a provided by someone server the name can change over time
        table.string("name")

        // In case of a server provided by us we don't have the IP until it is created
        table.integer("ip").nullable()

        table
            .integer("user_id")
            .references("users.id")
            .nullable()

        table.string("status").nullable() // ONLINE, OFFLINE
        table.string("password").nullable()

        table.string("rcon").nullable() // For servers provided by us
        table.string("slots").nullable() // For servers provided by us

        // Create the server
        table.dateTime("creation_request_at").nullable() // For servers provided by us
        table.dateTime("provisioned_at").nullable() // For servers provided by us

        // Destroy the server
        table.dateTime("destroy_at").nullable() // For servers provided by us
        table.dateTime("destroyed_at").nullable() // For servers provided by us

        table.timestamps()
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("servers")
}
