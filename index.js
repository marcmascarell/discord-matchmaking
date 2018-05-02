const database = require('./database');
const bot = require('./bot');
const tasks = require('./tasks');

database.init()
bot.init()
tasks.init()
