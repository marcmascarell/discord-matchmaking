## Discord Matchmaking Bot

Matchmaking bot made with [Discord.js](https://discord.js.org) (Node.js)

## Features

-   Matches (`!match`) & schedule matches (`!schedule-match`)
    -   Choose slots
    -   Choose map
    -   Choose datetime
-   List matches (`!list`)
-   List public servers (`!pub`)
-   List active streams (`!streams`)
-   Players can join/leave matches (`!join/!leave`)
-   Gameservers creation (Only COD(1) supported for now.)
    - Provisioned (@DigitalOcean) when the match is full
    - Players get a private message with the server credentials to join
-   Gameservers get autodestroyed after some time if the server is empty
-   Voice channels are auto created/destroyed
-   Admins can request info for matches (included sensitive information like password and rcon)
-   Matches are autocancelled if there is not activity and others 
-   Checks for Twitch streams and alerts when a stream starts

## Running the bot (Node.js 9.x)

-   `npm install`
-   Fill the required tokens in `secrets.ts` (rename the `secrets.examples.ts`)
-   `knex migrate:latest`
-   (Optional) `knex seed:run` // To have some test data
-   `npm run watch` / `npm run build` to compile ts files
-   `npm run dev`
-   Your bot should be ready
-   Generate an invite to your desired channel:

Put this in the bottom of `index.ts`

```js
bot.getClient().on("ready", async () => {
    try {
        let link = await client.generateInvite(["ADMINISTRATOR"])
        console.log(link)
    } catch (e) {
        console.log(e.stack)
    }
})
```

(You can erase the code block when you are done with the invitation)

## Migrate & refresh

```bassh
knex migrate:rollback

knex migrate:latest

knex seed:run
```

## Utilities

Get latest server snapshot
`node dist/Utilities/getSnap.js`

Get server passwords
`node dist/Utilities/getPasswords.js {serverName}`

## [Migrations](http://knexjs.org/#Migrations)

Once you have finished writing the migrations, you can update the database matching your NODE_ENV by running:

`knex migrate:latest`

You can also pass the --env flag or set NODE_ENV to select an alternative environment:

`knex migrate:latest --env production`

To rollback the last batch of migrations:

`knex migrate:rollback`

`knex seed:run`

Refresh:

```
knex migrate:rollback
knex migrate:latest
knex seed:run
```

## Code Style

We run a precommit hook that executes Prettier.

However, if you want to force Prettier's execution you can do it like this:

`npx prettier --write src/**/*`

## License

MIT
