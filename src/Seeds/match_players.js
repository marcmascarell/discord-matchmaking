exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex("match_players")
        .del()
        .then(function() {
            // Inserts seed entries
            return knex("match_players").insert([
                {
                    user_id: 1,
                    match_id: 1,
                },
                {
                    user_id: 2,
                    match_id: 1,
                },
                {
                    user_id: 3,
                    match_id: 1,
                },
                {
                    user_id: 4,
                    match_id: 2,
                },
                {
                    user_id: 5,
                    match_id: 2,
                },
                {
                    user_id: 6,
                    match_id: 6,
                },
                {
                    user_id: 7,
                    match_id: 7,
                },
                {
                    user_id: 11,
                    match_id: 8,
                },
                {
                    user_id: 12,
                    match_id: 8,
                },
            ])
        })
}
