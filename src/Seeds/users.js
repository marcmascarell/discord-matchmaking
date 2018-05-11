
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                {
                    id: '999',
                    username: 'Pepito',
                    discriminator: '1111',
                    avatar: 'someimage'
                },
                {
                    id: '888',
                    username: 'Menganito',
                    discriminator: '22222',
                    avatar: 'someimage2'
                },
                {
                    id: '777',
                    username: 'Retardadito',
                    discriminator: '33333',
                    avatar: 'someimage2'
                },
                {
                    id: '666',
                    username: 'Loler',
                    discriminator: '33333',
                    avatar: 'someimage2'
                },
                {
                    id: '555',
                    username: 'Nunker',
                    discriminator: '33333',
                    avatar: 'someimage2'
                },
                {
                    id: '444',
                    username: 'Sopla',
                    discriminator: '33333',
                    avatar: 'someimage2'
                },
                {
                    id: '333',
                    username: 'Neng',
                    discriminator: '33333',
                    avatar: 'someimage2'
                },
                {
                    id: '222',
                    username: 'Rubber',
                    discriminator: '33333',
                    avatar: 'someimage2'
                },
                {
                    id: '111',
                    username: 'Mutt',
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
