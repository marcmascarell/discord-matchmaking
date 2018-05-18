// This file must be on the server under /root/initServerConfig.js

const exec = require('child_process').exec;
const fs = require('fs')
const secrets = require('./secrets');

const publicIpCommand = "dig +short myip.opendns.com @resolver1.opendns.com"
const lgsmGameServerConfigPath = "/home/codserver/lgsm/config-lgsm/codserver/codserver.cfg"
const gameSpecificServerConfigPath = "/home/codserver/serverfiles/main/codserver.cfg"
const firebase = require('firebase-admin')
const _ = require('lodash')

let serverName = undefined
let serverConfig = undefined

firebase.initializeApp({
    credential: firebase.credential.cert(secrets.firebase)
});

const db = firebase.firestore();

const getServerName = () => {
    return new Promise((resolve, reject) => {
        exec('hostname', (error, stdout, stderr) => {
            if (stdout) {
                serverName = stdout.trim()

                console.log('hostname', serverName)

                resolve(serverName)
                return
            }

            if (error) {
                console.log(error)
                reject()
                return
            }

            if (stderr) {
                console.log(stderr)
                reject()
            }
        });
    });
}

const getConfigFromServerStore = () => {
    if (serverConfig) {
        return Promise.resolve(serverConfig)
    }

    return new Promise((resolve, reject) => {
        const gameServersCollection = db.collection('gameservers')

        gameServersCollection
            .doc(serverName)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    throw Error('No such document!')
                }

                const rawServerConfig = doc.data()
                serverConfig = []

                console.log('Server config found', rawServerConfig)

                _.each(rawServerConfig, (value, key) => {
                    // Some keys needed by `codserver.cfg`
                    if (key === 'maps') {
                        const firstMap = value[0]

                        serverConfig['defaultmap'] = {
                            key: 'map',
                            value: `mp_${firstMap}`,
                            file: lgsmGameServerConfigPath
                        }
                    }

                    if (key === 'slots') {
                        serverConfig['maxplayers'] = {
                            key: 'maxplayers',
                            value,
                            file: lgsmGameServerConfigPath
                        }
                    }

                    serverConfig[key] = {
                        key,
                        value,
                        file: lgsmGameServerConfigPath
                    }
                })

                console.log('Server config transformed', serverConfig)

                resolve(serverConfig)
            })
            .catch(e => {
                throw Error('Unable to get server config', e)
            })
    })
}

const applyGameSpecificConfig = () => {
    return new Promise((resolve, reject) => {
        const gameServerCfg = `
set sv_hostname "COD1 Community (discord.gg/yaKkZMF) ^1- ^7Match #${serverConfig.id.value}"
set scr_motd "Server provided by COD1 Community. Join ^1discord.gg/yaKkZMF"
set rconpassword "${serverConfig.rcon.value}"
set g_allowVoteMap "1"
set g_password "${serverConfig.password.value}"
set g_privatepassword "${secrets.server.privatepassword}"
    `
        try {
            console.log('Replacing game specific config file ('+gameSpecificServerConfigPath+')...')

            fs.writeFileSync(gameSpecificServerConfigPath, gameServerCfg, 'utf8');

            resolve()
        } catch (e) {
            console.log('setGameSpecificConfig failed', e.stack)

            reject()
        }
    });
}

/**
 * Applies server config for the match.
 *
 * @returns {Promise<any>}
 */
const applyServerConfig = () => {
    console.log(`Applying server config for hostname`, serverName)

    return new Promise((resolve, reject) => {
        if (!serverName) {
            return reject('No serverName')
        }

        const promises = []

        Object.values(serverConfig).forEach(option => {
            const regex = `${option.key}=\\"(.*)\\"`

            console.log('Replacing...', option.key, regex, option.value)

            promises.push(
                replaceInFile(option.file, new RegExp(regex,"g"), `${option.key}="${option.value}"`)
            )
        })

        Promise.all(promises).then(resolve).catch(reject)
    });
}

const replaceInFile = (file, search, replace) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('Replacing in file ('+file+')...', search, replace)

            const contents = fs.readFileSync(file, 'utf8')

            let result = contents.replace(search, replace);

            fs.writeFileSync(file, result, 'utf8');

            resolve()
        } catch (e) {
            console.log('replaceInFile failed', e.stack)

            reject()
        }
    });
}

const applyPublicIp = ip => {
    console.log(`Server IP is: ${ip}`)

    return replaceInFile(lgsmGameServerConfigPath, /ip=\"(.*)\"/g, `ip="${ip}"`);
}

const restartGameServer = () => {
    return new Promise((resolve, reject) => {
        exec('runuser -l codserver ./codserver restart', (error, stdout, stderr) => {
            if (stdout) {
                console.log('restartGameServer', stdout)

                resolve()
                return
            }

            if (error) {
                console.log(error)
                reject()
                return
            }

            if (stderr) {
                reject()
                console.log(stderr)
            }
        });
    })
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}


const retrieveGameServerInfo = () => {
    return new Promise((resolve, reject) => {
        exec('runuser -l codserver ./codserver details', (error, stdout, stderr) => {
            if (stdout) {
                console.log('retrieveGameServerInfo', stdout)
                const regex = /^(.*):\s+(.*)/gm;
                let m;
                let info = {}
                let formattedInfo = {}
                let lastKey;

                while ((m = regex.exec(stdout)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    // The result can be accessed through the `m`-variable.
                    m.forEach((match, groupIndex) => {
                        console.log(`Found match, group ${groupIndex}: ${match}`);

                        // Remove ANSI chars (colours)
                        match = match.replace(
                            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

                        if (groupIndex === 0) {
                            lastKey = match
                            info[lastKey] = {}
                        }

                        if (groupIndex === 1) {
                            info[lastKey].key = camelize(match)
                        }

                        if (groupIndex === 2) {
                            info[lastKey].value = match
                        }

                    });
                }

                Object.values(info).forEach(item => {
                    formattedInfo[item.key] = item.value
                })

                formattedInfo.lastChechedAt = (new Date()).toISOString()
                console.log(formattedInfo)

                db.collection('gameservers')
                    .doc(serverName)
                    .update({
                        ip: formattedInfo.serverIP,
                        status: formattedInfo.status.toLowerCase(),
                        map: formattedInfo.defaultMap,
                        slots: parseInt(formattedInfo.maxplayers, 10),
                        lastChechedAt: formattedInfo.lastChechedAt,
                        provisionedAt: formattedInfo.lastChechedAt,
                    })

                resolve(formattedInfo)
                return
            }

            if (error) {
                console.log(error)
                reject()
                return
            }

            if (stderr) {
                reject()
                console.log(stderr)
            }
        });
    })
}

const getGameServerStatus = () => {
    return new Promise((resolve, reject) => {
        retrieveGameServerInfo().then(info => {
            console.log('Game server status is', info.status)
            resolve(info.status)
        })
    })
}

const getServerIp = () => {
    return new Promise((resolve, reject) => {
        exec(publicIpCommand, async (error, stdout, stderr) => {
            if (stdout) {
                const ip = stdout.trim()

                return resolve(ip)
            }

            if (error) {
                console.log(error)
                return reject(error)
            }

            if (stderr) {
                console.log(stderr)
                return reject(stderr)
            }
        });
    })
}

(async () => {
    try {
        const ip = await getServerIp()

        await getServerName()
        await getConfigFromServerStore()
        await applyServerConfig()
        await applyGameSpecificConfig()
        await applyPublicIp(ip)
        await restartGameServer()
        await getGameServerStatus()
    } catch (e) {
        console.log('big fail', e)
    }
})()
