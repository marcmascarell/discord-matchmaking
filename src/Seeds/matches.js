const moment = require("moment")

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex("matches")
        .del()
        .then(function() {
            // Inserts seed entries
            return knex("matches").insert([
                {
                    id: 1,
                    name: "The first match",
                    max_players: 4,
                    server_id: 1,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    last_activity_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                    maps: "germantown,carentan,harbor",
                },
                {
                    id: 2,
                    max_players: 10,
                    name: "The second match",
                    server_id: 2,
                    // Not recent
                    created_at: moment()
                        .subtract(3, "hour")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    last_activity_at: moment()
                        .subtract(3, "hour")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    maps: "random",
                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                },
                {
                    id: 3,
                    max_players: 10,
                    name: "Should be declared inactive in 1 minute aprox",
                    server_id: null,
                    created_at: moment()
                        .subtract(1, "hour")
                        .format("YYYY-MM-DD HH:mm:ss"),

                    // About to be inactive
                    last_activity_at: moment()
                        .subtract(14, "minutes")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    maps: "random",
                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                },
                {
                    id: 4,
                    max_players: 10,
                    name: "Deleted inactive match",
                    server_id: null,
                    created_at: moment()
                        .subtract(1, "hour")
                        .format("YYYY-MM-DD HH:mm:ss"),

                    // It was already canceled
                    last_activity_at: moment()
                        .subtract(16, "minutes")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    canceled_reason: "INACTIVITY",
                    maps: "random",
                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                },
                {
                    id: 5,
                    max_players: 10,
                    name: "Should be declarer ended and server destroyed",
                    server_id: 5,
                    created_at: moment()
                        .subtract(1, "hour")
                        .format("YYYY-MM-DD HH:mm:ss"),

                    // It was already canceled
                    last_activity_at: moment()
                        .subtract(16, "minutes")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    canceled_reason: null,
                    maps: "random",

                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                },
                // Scheduled match that should be given as not filled
                {
                    id: 6,
                    max_players: 2,
                    scheduled_at: moment()
                        .add(1, "minute")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    name: "Scheduled match",
                    server_id: null,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),

                    // It was already canceled
                    last_activity_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    canceled_reason: null,
                    maps: "random",

                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                },
                // Not filled future scheduled match
                {
                    id: 7,
                    max_players: 2,
                    scheduled_at: moment()
                        .add(15, "minutes")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    name: "Scheduled match",
                    server_id: null,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),

                    last_activity_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    canceled_reason: null,
                    maps: "random",

                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                },
                // Filled future scheduled match, server should be created
                {
                    id: 8,
                    max_players: 2,
                    scheduled_at: moment()
                        .add(5, "minutes")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    name: "Filled scheduled match",
                    server_id: null,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),

                    last_activity_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    canceled_reason: null,
                    maps: "random",

                    guild_id: "439806672911859713",
                    channel_id: "439806672911859717",
                },
            ])
        })
}
