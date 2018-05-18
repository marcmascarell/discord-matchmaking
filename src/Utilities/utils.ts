import Match from "../Models/Match"
import secrets from "../secrets"
import {Guild, GuildResolvable} from "discord.js"

const https = require('https')
const _ = require('lodash');
const crypto = require('crypto');

const getRconForServer = (serverName : string) => {
    return crypto.createHash('md5').update(serverName + secrets.rconSalt).digest("hex")
}

const getPasswordForServer = (serverName : string) => {
    return crypto.createHash('md5').update(serverName + secrets.passwordSalt).digest("hex").substring(2, 7)
}

/**
 *
 * @param match map-carentan-S-slots-6-S-match-30
 */
const getServerNameForMatch = (match : Match) => {
    return `${isDevelopment ? 'Test-' : ''}Match-${match.id}`
}

const prettifyMapName = (name) => {
    return _.startCase(
        name.replace('mp_', '').replace('_', '')
    )
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

const isGuildOnlyDev = (guild : GuildResolvable) => {
    const id = guild instanceof Guild ? guild.id : guild

    return includes(secrets.guilds.development, id)
}

// We don't want to use _.includes because it searches for substring
// Native .includes() isn't well supported yet
const includes = (collection, value) => {
    const found = _.find(collection, item => item === value);

    return found !== undefined
}

const getEnvironment = () => process.env.NODE_ENV
const isDevelopment = () => process.env.NODE_ENV === 'development'
const isProduction = () => process.env.NODE_ENV === 'production'

export default {
    getRconForServer,
    getPasswordForServer,
    getServerNameForMatch,
    isServerReady,
    getEnvironment,
    isGuildOnlyDev,
    isDevelopment,
    isProduction,
    includes,
    prettifyMapName
}
