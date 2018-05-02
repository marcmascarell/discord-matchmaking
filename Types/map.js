const Commando = require('discord.js-commando');
const _ = require('lodash');

class MapArgumentType extends Commando.ArgumentType {
    constructor(client) {
        super(client, 'map');
    }

    static getRandom() {
        return _.sample(MapArgumentType.maps);
    }

    static getMapImage(map) {
        const name = map.toLowerCase()

        if (MapArgumentType.mapsImages[name]) {
            return MapArgumentType.mapsImages[name]
        }

        return null
    }

    static get mapsImages() {
        return {
            'carentan': 'https://cdn.discordapp.com/attachments/438725577831219210/439861910893232128/car.png',
            'dawnville': ' https://cdn.discordapp.com/attachments/438725577831219210/439858926020853760/Dawnville.jpg.80f5142d162d1ead6b0551ab69db3530.jpg',
            'harbor': 'https://cdn.discordapp.com/attachments/438725577831219210/439862045962272785/hb.png',
            'neuville': 'https://cdn.discordapp.com/attachments/438725577831219210/439860709464211456/neuville.png',
            'railyard': 'https://cdn.discordapp.com/attachments/438725577831219210/439862016803340290/RY.png',
            'brecourt': 'https://cdn.discordapp.com/attachments/438725577831219210/439861866362306560/brec.png',
            'depot': 'https://cdn.discordapp.com/attachments/438725577831219210/439861929062957086/dep.png',
            'tigertown': 'https://cdn.discordapp.com/attachments/438725577831219210/439863243884855296/tiger.png',
            'pavlov': 'https://cdn.discordapp.com/attachments/438725577831219210/439863224003854346/pav.png',
            'pow camp': 'https://cdn.discordapp.com/attachments/438725577831219210/439861973232910336/pow.png',
            'stalingrad': 'https://cdn.discordapp.com/attachments/438725577831219210/439863261610115083/stal.png',
        };
    }

    static get maps() {
        return [
            'Carentan',
            'Dawnville',
            'Harbor',
            'Neuville',
            'Railyard',

            // 'Brecourt',
            // 'Depot',
            // 'Tigertown',
            //
            // 'Pavlov',
            // 'POW Camp',
            // 'Stalingrad',

            // 'Bocage',
            // 'Hurtgen',
            // 'Rocket',
            // 'Ship',

            // 'Chateau', NO SD
        ]
    }

    lowercasedMaps() {
        const lowercaseMaps = []

        MapArgumentType.maps.forEach(map => {
            lowercaseMaps.push(map.toLowerCase())
        })

        return lowercaseMaps
    }

    validate(val) {
        return this.lowercasedMaps().includes(this.parse(val));
    }

    parse(val) {
        return val.toLowerCase();
    }
}

module.exports = MapArgumentType;
