
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                {
                    id: '99999999',
                    username: 'Pepito',
                    discriminator: '1111',
                    avatar: 'someimage'
                },
                {
                    id: '88888888',
                    username: 'Menganito',
                    discriminator: '22222',
                    avatar: 'someimage2'
                },
                {
                    id: '77777777',
                    username: 'Retardadito',
                    discriminator: '33333',
                    avatar: 'someimage2'
                },
                {
                    id: '352164487001800706',
                    username: 'helmz',
                    discriminator: '6028',
                    avatar: 'someimage2'
                },
            ]);
        });
};
