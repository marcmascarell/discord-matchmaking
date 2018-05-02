const secrets = require('../secrets')
const https = require('https')
const _ = require('lodash');
const crypto = require('crypto');

const getRconForServer = (serverName) => {
    return crypto.createHash('md5').update(serverName + secrets.rconSalt).digest("hex")
}

const getPasswordForServer = (serverName) => {
    return crypto.createHash('md5').update(serverName + secrets.passwordSalt).digest("hex").substring(2, 7)
}

const getSlotsForMatch = match => {
    return match.maxPlayers + 2
}

/**
 *
 * @param match
 */
const getServerNameForMatch = match => {
    const firstMap = match.maps.split(',')[0]

    const options = {
        map: firstMap.toLowerCase(),
        slots: getSlotsForMatch(match),
        match: match.id,
    }

    let name = ''

    _.each(options, (value, key) => {
        name += `${key}-${value}-S-`
    })

    name = name.slice(0, -3)

    return name
}

const getServers = () => {
    const url = `https://www.jsonstore.io/${secrets.jsonStore}`

    return new Promise((resolve, reject) => {
        https.get(url, function(res){
            let body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){
                const parsedBody = JSON.parse(body)

                const servers = parsedBody.result && parsedBody.result.servers ? parsedBody.result.servers : {}
                resolve(servers)
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
            reject(e)
        });
    })
}

const isServerReady = (serverName) => {
    return new Promise((resolve, reject) => {
        getServers()
            .then(servers => {
                if (servers[serverName] !== undefined) {
                    return resolve(servers[serverName])
                }

                resolve(false)
            })
            .catch(reject)
    })
}

const getEnvironment = () => process.env.NODE_ENV
const isDevelopment = () => process.env.NODE_ENV === 'development'
const isProduction = () => process.env.NODE_ENV === 'production'

module.exports = {
    getRconForServer,
    getPasswordForServer,
    getServerNameForMatch,
    isServerReady,
    getSlotsForMatch,
    getEnvironment,
    isDevelopment,
    isProduction,
}
