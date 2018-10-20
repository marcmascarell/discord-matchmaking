import database from "./database"
import bot from "./bot"
import tasks from "./tasks"
import moment from "moment-timezone"

moment.tz.setDefault("Europe/Berlin")

database.init()

bot.init().then(tasks.init)

const client = bot.getClient()
client.on("error", e => console.error(e))
client.on("warn", e => console.warn(e))
// client.on("debug", (e) => console.info(e));
