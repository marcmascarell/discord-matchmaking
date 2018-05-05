var DigitalOcean = require('dots-wrapper').DigitalOcean;
var secrets = require('../secrets');
var ServerLimitReached = require('../Errors/ServerLimitReached');
var digitalOcean = new DigitalOcean(secrets.digitalOceanToken);
// digitalOcean.Account.get().subscribe(account => console.log(account), err => console.log(err.message));
// digitalOcean.Snapshot.list(0, 5).subscribe(account => console.log(account), err => console.log(err.message));
var serverLimit = 3;
var isLimitReached = function () {
    return new Promise(function (resolve, reject) {
        digitalOcean.Droplet.list('codserver', 0, 5).subscribe(function (response) {
            if (response.total >= serverLimit) {
                return resolve(true);
            }
            resolve(false);
        }, function (err) {
            console.log(err.message);
            reject(err.stack);
        });
    });
};
var create = function (match) {
    return new Promise(function (resolve, reject) {
        isLimitReached()
            .then(function (isLimitReached) {
            if (isLimitReached) {
                throw new ServerLimitReached();
            }
            var name = match.getServerName();
            digitalOcean.Droplet.create({
                name: name,
                region: 'fra1',
                size: 's-1vcpu-1gb',
                image: 33885904,
                // ssh_keys?: string[];
                tags: [
                    'codserver',
                    "match-" + match.id
                ]
            }).subscribe(function (server) {
                if (server.name) {
                    resolve(server);
                }
                else {
                    throw new Error('Failed to create server');
                }
            }, function (err) {
                console.log(err);
                reject(err);
            });
        })
            .catch(function (e) { return reject(e); });
    });
};
var destroy = function (match) {
    return new Promise(function (resolve, reject) {
        digitalOcean.Droplet.delete("match-" + match.id).subscribe(function () {
            console.log('droplet delete', match.id);
            resolve();
        }, function (err) {
            console.log(err);
            reject(err);
        });
    });
};
export default {
    create: create,
    destroy: destroy,
    isLimitReached: isLimitReached
};
// digitalOcean.Region.list(0, 10).subscribe(
//     response => {
//         const region = response.items.find(region => region.slug === 'fra1')
//         console.log(region)
//     },
//     err => console.log(err.message)
// );
// digitalOcean.Size.list(0, 30).subscribe(account => console.log(account), err => console.log(err.message));
