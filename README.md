Discord Matchmaking Bot
-----------------

Matchmaking bot made with [Discord.js](https://discord.js.org) (Node.js)

Features
----------
- Match creation
    - Choose slots
    - Choose map
- List matches
- Players can !join / !leave
- Game servers creation
    - Only COD(1) supported for now. 
    - Provisioned (@DigitalOcean) for the match when all slots are filled and players get a private message with the server credentials to join
- Game servers are destroyed after some time if the server is empty
- Voice channels are created for the match and destroyed after some time
- Admins can request info for matches (included sensitive information like password and rcon)
- Matches get erased after a period of inactivity if they were not completed
- Matches get erased when all players leave
- Checks for game streams and alerts when a stream starts

Running the bot (Node.js 9.x)
----------
- `npm install`
- Fill the required tokens in `secrets.ts` (rename the `secrets.examples.ts`)
- `knex migrate:latest`
- (Optional) `knex seed:run` // To have some test data
- `npm run watch` / `npm run build` to compile ts files
- `npm run dev`
- Your bot should be ready
- Generate an invite to your desired channel:

Put this in the bottom of `index.ts`
```js
bot.getClient().on('ready', async () => {
    try {
        let link = await client.generateInvite(["ADMINISTRATOR"])
        console.log(link)
    } catch (e) {
        console.log(e.stack)
    }
})
```
(You can erase the code block when you are done with the invitation)

Utilities
----------

Get latest server snapshot
`node dist/Utilities/getSnap.js`

Get server passwords
`node dist/Utilities/getPasswords.js {serverName}`

Caveats
----------
Solving "error TS2339: Property 'applyFilter' does not exist on type" objection.js error:

Change the typings from node_modules with this:
https://github.com/Vincit/objection.js/blob/master/typings/objection/index.d.ts

It is a temporal solution until they release a new version which will include the fix.

[Migrations](http://knexjs.org/#Migrations)
----------
Once you have finished writing the migrations, you can update the database matching your NODE_ENV by running:

`knex migrate:latest`

You can also pass the --env flag or set NODE_ENV to select an alternative environment:

`knex migrate:latest --env production`

To rollback the last batch of migrations:

`knex migrate:rollback`

`knex seed:run`

Refresh:
`knex migrate:rollback && knex migrate:latest && knex seed:run`

License
----------
MIT
