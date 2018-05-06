import database from './database'
import bot from './bot'
import tasks from './tasks'

database.init()
bot.init()
tasks.init()

const client = bot.getClient()
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
// client.on("debug", (e) => console.info(e));

bot.getClient().on('ready', async () => {
    try {
        let link = await client.generateInvite(["ADMINISTRATOR"])
        console.log(link)
    } catch (e) {
        console.log(e.stack)
    }
})
