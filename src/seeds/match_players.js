
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('match_players').del()
        .then(function () {
            // Inserts seed entries
            return knex('match_players').insert([
                {
                    user_id: 999,
                    match_id: 1
                },
                {
                    user_id: 888,
                    match_id: 1
                },
                {
                    user_id: 777,
                    match_id: 1
                },
                {
                    user_id: 111,
                    match_id: 2
                },
            ]);
        });
};
