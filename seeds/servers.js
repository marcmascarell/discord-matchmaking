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
                    user_id: 88888888,
                    destroy_at: moment().add('1', 'minute').format('YYYY-MM-DD HH:mm:ss'),
                    destroyed_at: null,
                },
                {
                    name: 'Provided by user',
                    user_id: 99999999
                },
                {
                    name: 'Provided by the system',
                }
            ]);
        });
};
