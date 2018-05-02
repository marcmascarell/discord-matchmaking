const moment = require('moment')

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('matches').del()
        .then(function () {
            // Inserts seed entries
            return knex('matches').insert([
                {
                    id: 1,
                    name: 'The first match',
                    max_players: 4,
                    server_id: 1,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    last_activity_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    guild_id: '439806672911859713',
                    channel_id: '439806672911859717',
                    maps: 'carentan,harbor'
                },
                {
                    id: 2,
                    max_players: 10,
                    name: 'The second match',
                    server_id: 2,
                    // Not recent
                    created_at: moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                    last_activity_at: moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                    maps: 'random',
                    guild_id: '439806672911859713',
                    channel_id: '439806672911859717',
                }
            ]);
        });
};
