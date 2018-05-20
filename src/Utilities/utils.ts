import secrets from "../secrets"
import {Guild, GuildResolvable} from "discord.js"
import moment from 'moment'
import request from 'request'
import _ from 'lodash'
import https from 'https'
import crypto from 'crypto'

const getRconForServer = (serverName : string) => {
    return crypto.createHash('md5').update(serverName + secrets.rconSalt).digest("hex")
}

const getPasswordForServer = (serverName : string) => {
    return crypto.createHash('md5').update(serverName + secrets.passwordSalt).digest("hex").substring(2, 7)
}

const getServerNameForMatch = ({ id }) => {
    return `${isDevelopment ? 'Test-' : ''}Match-${id}`
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

/**
 *
 * @param {boolean} onlyStartedRecently
 * @returns {Promise<any>}
 */
const getStreams = (onlyStartedRecently = false) => {
    return new Promise((resolve, reject) => {
        const options = {
            url: 'https://api.twitch.tv/helix/streams',
            headers: {
                'Client-ID': secrets.twitch.clientId
            },
            qs: {
                user_login: secrets.streamers,
                useQuerystring: true
            }
        };

        request(options, function (error, response, body) {
            if (!response || response.statusCode !== 200) {
                return reject('Unable to get streams.')
            }

            const result = JSON.parse(body)

            const streams = result.data.filter(stream => {
                // COD
                if (stream.game_id !== '1494') {
                    return false;
                }

                // if (stream.type !== 'live') {
                //     return false;
                // }

                if (onlyStartedRecently) {
                    const minutesFromStart = moment().diff(moment(stream.started_at), 'minutes')

                    return minutesFromStart < 5
                }

                return true
            })

            resolve(streams)
        });
    })
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
    prettifyMapName,
    getStreams
}
