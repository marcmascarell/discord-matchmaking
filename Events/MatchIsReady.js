const MatchCard = require('../Embeds/MatchCard')
const gameServerManager = require('../server/gameServerManager')
const ServerLimitReached = require('../Errors/ServerLimitReached')
const Match = require('../Models/Match')
const bot = require('../bot')

module.exports = class MatchIsReady {
    constructor(channel, match) {
        MatchIsReady.notify(channel, match)

        gameServerManager
            .create(match)
            .then(() => {
                console.log('Waiting for server')

                const maxRetries = 30 // 5 minutes, normally it takes about 3 minutes but DO has shortages sometimes so we are a bit more patient
                let retries  = 0

                // Wait 1 minute before looking for the server
                setTimeout(() => {
                    const interval = setInterval(() => {
                        match.isServerReady()
                            .then(matchWithServer => {
                                if (matchWithServer) {
                                    console.log('Server ready', matchWithServer)

                                    this.onServerCreated(channel, matchWithServer)

                                    clearInterval(interval)
                                    return
                                }

                                if (retries === maxRetries / 2) {
                                    channel.send(`Waiting server for match ${match.id}... Hold on...`)
                                }

                                if (retries >= maxRetries) {
                                    clearInterval(interval)
                                    throw new Error("Looking for server max retries reached")
                                }

                                retries++
                                console.log('Waiting for server loop...', retries)
                            })
                            .catch(e => {
                                channel.send(`Unable to create a server for match ${match.id} :(`)

                                console.log(e.stack)
                                clearInterval(interval)
                            })
                    }, 10000)
                }, 60000)
            })
            .catch(e => {
                if (e instanceof ServerLimitReached) {
                    channel.send(`Unable to create a server for match ${match.id}. Server limit reached.`)
                } else {
                    channel.send(`Unable to create a server for match ${match.id} :(`)
                }
            })
    }

    onServerCreated(channel, match) {
        const minutes = 75 // minutes until match is declared ended

        if (! match.isServerOnline()) {
            channel.send(`Something went wrong provisioning the server for match ${match.id}...`)

            return
        }

        const playersIds = match.playerIds()

        const players = bot.getClient()
            .guilds
            .find(guild => guild.id === channel.guild.id)
            .members
            .filter((member) => {
                return playersIds.includes(member.user.id)
            })

        players.forEach(player => {
            player.createDM().then(channel => {
                channel.send(
                    `Your match ${match.id} is ready:` +
                    `\r\n` +
                    '`' + `/connect ${match.server.ip}; password ${match.server.password}` + '`' +
                    `\r\n- Do not start the game until all players are ready (You won't be able to restart the map)` +
                    `\r\n- You are expected to behave and respect the common sense rules` +
                    `\r\nGood luck & Have fun! (Server will self-destroy after ${minutes} minutes)`
                )
            })
        })

        channel.send(`Server for match ${match.id} ready! DM sent to players!`)
    }

    static notify(channel, match) {
        const embed = new MatchCard(match)

        embed.setTitle('Match is ready')
        embed.setColor('#2db600')

        embed.addField('Randomizing teams...', '(Take it as a suggestion)')

        const randomPlayers = match.playerNames()

        const allies = randomPlayers.slice(0, match.playersPerTeam)
        const axis = randomPlayers.slice(match.playersPerTeam)

        if (allies.length) {
            embed.addField('Allies', allies.join(','))
        }

        if (axis.length) {
            embed.addField('Axis', axis.join(','))
        }

        embed.setFooter(`Preparing server... (~3min. aprox)`)

        channel.send(embed)
    }
};
