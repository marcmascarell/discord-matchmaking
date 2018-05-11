import Match from "../Models/Match"

const { DigitalOcean } = require('dots-wrapper');
import secrets from '../secrets'
import ServerLimitReached from '../Errors/ServerLimitReached'
import utils from "../Utilities/utils"

const digitalOcean = new DigitalOcean(secrets.digitalOceanToken);

// digitalOcean.Account.get().subscribe(account => console.log(account), err => console.log(err.message));
// digitalOcean.Snapshot.list(0, 5).subscribe(account => console.log(account), err => console.log(err.message));

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

const create = ({id, name} : {id: number, name: string}) => {
    const match = {id, name}
    console.log(`Creating server for match #${match.id}...`)
    return new Promise((resolve, reject) => {
        isLimitReached()
        .then(isLimitReached => {
            if (isLimitReached) {
                throw new ServerLimitReached()
            }

            digitalOcean.Droplet.create({
                name: name,
                region: 'fra1',
                size: 's-1vcpu-1gb',
                image: 34250946,
                // ssh_keys?: string[];
                tags: [
                    getServerTag(),
                    getMatchTag(match)
                ]
            }).subscribe((server : any) => {
                if (server.name) {
                    resolve(server)
                } else {
                    throw new Error('Failed to create server')
                }
            }, (err : Error) => {
                console.log(err)
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

const getMatchTag = (match) => {
    // Avoid dev environment from interfere official servers
    return utils.isDevelopment() ? `test-match-${match.id}` : `match-${match.id}`
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

        digitalOcean.Droplet.delete(getMatchTag(match)).subscribe(() => {
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
    isLimitReached
}


// digitalOcean.Region.list(0, 10).subscribe(
//     response => {
//         const region = response.items.find(region => region.slug === 'fra1')
//         console.log(region)
//     },
//     err => console.log(err.message)
// );
// digitalOcean.Size.list(0, 30).subscribe(account => console.log(account), err => console.log(err.message));
