import Match from "../Models/Match"

const { DigitalOcean } = require('dots-wrapper');
import secrets from '../secrets'
import ServerLimitReached from '../Errors/ServerLimitReached'
import utils from "../Utilities/utils"
import _ from "lodash"
import firestore from "../firestore"
import moment from "moment"

const digitalOcean = new DigitalOcean(secrets.digitalOceanToken);

// digitalOcean.Account.get().subscribe(account => console.log(account), err => console.log(err.message));

const serverLimit = 3

const isLimitReached = () => {
    return new Promise((resolve, reject) => {
        digitalOcean.Droplet.list(getServerTag(), 0, 5).subscribe((response : any) => {
            if (response.total >= serverLimit) {
                return resolve(true)
            }

            resolve(false)
        }, (err: Error) => {
            console.log(err.message)
            reject(err.stack)
        });
    })
}

const getLatestSnapshot = () => {
    return new Promise((resolve, reject) => {
        digitalOcean
            .Snapshot.list(0, 5)
            .subscribe(
                response => {
                    const latestSnapshot = _.last(response.items)

                    console.log('latestSnapshot', latestSnapshot)

                    resolve(latestSnapshot)
                },
                err => console.log(err.message));
    })
}

/**
 *
 * @param {string} name
 * @param {id?: number; maps: Array<string>; slots: number} options
 * @returns {Promise<any>}
 */
const create = (
    name: string,
    options : {
        id?: number,
        maps: Array<string>,
        slots: number,
    }
) => {
    return new Promise((resolve, reject) => {
        isLimitReached()
        .then(isLimitReached => {
            if (isLimitReached) {
                throw new ServerLimitReached()
            }

            const gameServersCollection = firestore
                .getClient()
                .collection('gameservers')

            gameServersCollection
                .doc(name)
                .set(Object.assign(
                    {},
                    {
                        name,
                        password: utils.getPasswordForServer(name),
                        rcon: utils.getRconForServer(name),
                        status: 'creating',
                        creationRequestedAt: moment().toISOString(),
                    },
                    options
                ))
                .catch(e => {
                    console.log('Failed to create server in store', e)
                })

            digitalOcean.Droplet.create({
                name: name,
                region: 'fra1',
                size: 's-1vcpu-1gb',
                image: 34833901,
                // ssh_keys?: string[];
                tags: [
                    getServerTag(),
                    name
                ]
            }).subscribe((server : any) => {
                if (server.name) {
                    resolve(server)
                } else {
                    throw new Error('Failed to create server')
                }
            }, (err : Error) => {
                console.log('Digital Ocean Error', err)
                reject(err)
            });
        })
        .catch(e => reject(e))
    })
}

const getServerTag = () => {
    // Avoid dev environment from interfere official servers
    return utils.isDevelopment() ? `test-codserver` : `codserver`
}

const destroy = (match : Match) => {
    console.log('server to destroy', match.server)
    console.log('from match', match)
    return new Promise((resolve, reject) => {
        if (match.server.ip === null) {
            console.log('"Destroying" test server, avoided DO call')
            resolve()
            return;
        }

        digitalOcean.Droplet.delete(utils.getServerNameForMatch(match)).subscribe(() => {
            console.log('droplet delete', match.id)
            resolve()
        }, (err: Error) => {
            console.log(err)
            reject(err)
        });
    })
}

export default {
    create,
    destroy,
    isLimitReached,
    getLatestSnapshot
}


// digitalOcean.Region.list(0, 10).subscribe(
//     response => {
//         const region = response.items.find(region => region.slug === 'fra1')
//         console.log(region)
//     },
//     err => console.log(err.message)
// );
// digitalOcean.Size.list(0, 30).subscribe(account => console.log(account), err => console.log(err.message));
