
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('match_players').del()
        .then(function () {
            // Inserts seed entries
            return knex('match_players').insert([
                {
                    user_id: 99999999,
                    match_id: 1
                },
                {
                    user_id: 88888888,
                    match_id: 1
                },
                {
                    user_id: 77777777,
                    match_id: 2
                },
            ]);
        });
};
