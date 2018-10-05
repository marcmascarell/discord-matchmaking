// To be used as command line script `node getPasswords.js server-name`
import utils from "./utils"

const serverName = process.argv[2]

console.log({
    serverName,
    rcon: utils.getRconForServer(serverName),
    password: utils.getPasswordForServer(serverName),
})

process.exit(0)
