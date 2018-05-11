const moment = require('moment')

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('servers').del()
        .then(function () {
            // Inserts seed entries
            return knex('servers').insert([
                {
                    id: 1,
                    name: 'The seeded server name',
                    user_id: 888,
                    // This can't be destroyed because is a user server
                    destroy_at: moment().add('1', 'minute').format('YYYY-MM-DD HH:mm:ss'),
                    destroyed_at: null,
                },
                {
                    id: 2,
                    name: 'Provided by user',
                    user_id: 999
                },


                {
                    id: 5,
                    name: 'Should be destroyed very soon',
                    destroyed_at: null,
                    destroy_at: moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                }
            ]);
        });
};
