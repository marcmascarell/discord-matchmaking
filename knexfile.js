// Update with your config settings.
const directories = {
    migrations: './src/migrations',
    seeds: './src/seeds',
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
            filename: '../shared/database.sqlite3'
        },
        migrations: {
            directory: directories.migrations
        }
    }

};
