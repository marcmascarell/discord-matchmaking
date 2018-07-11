import database from './database'
import bot from './bot'
import tasks from './tasks'
import LogUserActivity from './Models/LogUserActivity'
import LogProcessedActivity from "./Models/LogProcessedActivity";
const moment = require('moment');
const _ = require('lodash');

database.init()
bot.init()
tasks.init()

const client = bot.getClient()
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
// client.on("debug", (e) => console.info(e));



