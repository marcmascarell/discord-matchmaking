import Match from "../Models/Match"
import secrets from "../secrets"

const https = require('https')
const _ = require('lodash');
const crypto = require('crypto');

const getRconForServer = (serverName : string) => {
    return crypto.createHash('md5').update(serverName + secrets.rconSalt).digest("hex")
}

const getPasswordForServer = (serverName : string) => {
    return crypto.createHash('md5').update(serverName + secrets.passwordSalt).digest("hex").substring(2, 7)
}

const getSlotsForMatch = (match : Match) => {
    return match.maxPlayers + 2
}

/**
 *
 * @param match
 */
const getServerNameForMatch = (match : Match) => {
    const firstMap = match.maps.split(',')[0]

    const options = {
        map: firstMap.toLowerCase(),
        slots: getSlotsForMatch(match),
        match: match.id,
    }

    let name = ''

    _.each(options, (value : string, key : string) => {
        name += `${key}-${value}-S-`
    })

    name = name.slice(0, -3)

    return name
}

const getServers = () => {
    const url = `https://www.jsonstore.io/${secrets.jsonStore}?v=${+ new Date()}`

    return new Promise((resolve, reject) => {
        https.get(url, function(res : any){
            let body = '';

            res.on('data', function(chunk : any){
                body += chunk;
            });

            res.on('end', function(){
                const parsedBody = JSON.parse(body)

                const servers = parsedBody.result && parsedBody.result.servers ? parsedBody.result.servers : {}
                resolve(servers)
            });
        }).on('error', function(e : Error){
            console.log("Got an error: ", e);
            reject(e)
        });
    })
}

const isServerReady = (serverName : string) => {
    return new Promise((resolve, reject) => {
        getServers()
            .then((servers : any) => {
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

export default {
    getRconForServer,
    getPasswordForServer,
    getServerNameForMatch,
    isServerReady,
    getSlotsForMatch,
    getEnvironment,
    isDevelopment,
    isProduction,
}
