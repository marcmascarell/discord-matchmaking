exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex("users")
        .del()
        .then(function() {
            // Inserts seed entries
            return knex("users").insert([
                {
                    id: 1,
                    discord_id: "999",
                    discord_username: "Pepito",
                    discord_discriminator: "1111",
                    discord_avatar: "someimage",
                },
                {
                    id: 2,
                    discord_id: "888",
                    discord_username: "Menganito",
                    discord_discriminator: "22222",
                    discord_avatar: "someimage2",
                },
                {
                    id: 3,
                    discord_id: "777",
                    discord_username: "Retardadito",
                    discord_discriminator: "33333",
                    discord_avatar: "someimage2",
                },
                {
                    id: 4,
                    discord_id: "666",
                    discord_username: "Loler",
                    discord_discriminator: "33333",
                    discord_avatar: "someimage2",
                },
                {
                    id: 5,
                    discord_id: "555",
                    discord_username: "Nunker",
                    discord_discriminator: "33333",
                    discord_avatar: "someimage2",
                },
                {
                    id: 6,
                    discord_id: "444",
                    discord_username: "Sopla",
                    discord_discriminator: "33333",
                    discord_avatar: "someimage2",
                },
                {
                    id: 7,
                    discord_id: "333",
                    discord_username: "Neng",
                    discord_discriminator: "33333",
                    discord_avatar: "someimage2",
                },
                {
                    id: 8,
                    discord_id: "222",
                    discord_username: "Rubber",
                    discord_discriminator: "33333",
                    discord_avatar: "someimage2",
                },
                {
                    id: 9,
                    discord_id: "111",
                    discord_username: "Mutt",
                    discord_discriminator: "33333",
                    discord_avatar: "someimage2",
                },
                {
                    id: 10,
                    discord_id: "352164487001800706",
                    discord_username: "helmz",
                    discord_discriminator: "6028",
                    discord_avatar: "someimage2",
                },
            ])
        })
}
