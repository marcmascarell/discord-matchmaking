// Update with your config settings.
const directories = {
    migrations: './src/Migrations',
    seeds: './src/Seeds',
}

module.exports = {

    development: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: './dev.sqlite3'
        },
        migrations: {
            directory: directories.migrations
        },
        seeds: {
            directory: directories.seeds
        }
    },

    production: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: '/var/www/discord-matchmaking/database.sqlite3'
        },
        migrations: {
            directory: directories.migrations
        }
    }

};
