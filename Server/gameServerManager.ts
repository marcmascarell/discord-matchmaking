const { DigitalOcean } = require('dots-wrapper');
const secrets = require('../secrets');
const ServerLimitReached = require('../Errors/ServerLimitReached');

const digitalOcean = new DigitalOcean(secrets.digitalOceanToken);

// digitalOcean.Account.get().subscribe(account => console.log(account), err => console.log(err.message));
// digitalOcean.Snapshot.list(0, 5).subscribe(account => console.log(account), err => console.log(err.message));

const serverLimit = 3

const isLimitReached = () => {
    return new Promise((resolve, reject) => {
        digitalOcean.Droplet.list('codserver', 0, 5).subscribe(response => {
            if (response.total >= serverLimit) {
                return resolve(true)
            }

            resolve(false)
        }, err => {
            console.log(err.message)
            reject(err.stack)
        });
    })
}

const create = (match) => {
    return new Promise((resolve, reject) => {
        isLimitReached()
        .then(isLimitReached => {
            if (isLimitReached) {
                throw new ServerLimitReached()
            }

            const name = match.getServerName()

            digitalOcean.Droplet.create({
                name: name,
                region: 'fra1',
                size: 's-1vcpu-1gb',
                image: 33885904,
                // ssh_keys?: string[];
                tags: [
                    'codserver',
                    `match-${match.id}`
                ]
            }).subscribe(server => {
                if (server.name) {
                    resolve(server)
                } else {
                    throw new Error('Failed to create server')
                }
            }, err => {
                console.log(err)
                reject(err)
            });
        })
        .catch(e => reject(e))
    })
}

const destroy = (match) => {
    return new Promise((resolve, reject) => {
        digitalOcean.Droplet.delete(`match-${match.id}`).subscribe(() => {
            console.log('droplet delete', match.id)
            resolve()
        }, err => {
            console.log(err)
            reject(err)
        });
    })
}

module.exports = {
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
