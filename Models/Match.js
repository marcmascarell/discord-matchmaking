const _ = require('lodash');
const moment = require('moment');
const utils = require('../Utilities/utils');
const bot = require('../bot');
const Model = require('./BaseModel');
const DeletedMatchDueToMatchEnding = require('../Events/DeletedMatchDueToMatchEnding');
const DeletedMatchDueToDesertion = require('../Events/DeletedMatchDueToDesertion');
const DeletedMatchDueToInactivity = require('../Events/DeletedMatchDueToInactivity');

class Match extends Model {
    static get tableName() {
        return 'matches';
    }

    static get virtualAttributes() {
        return [
            'isReady',
            'isWaitingForPlayers',
            'mapNames',
            'playersPerTeam',
            'playerNames',
            'playerIds'
        ];
    }

    static get namedFilters() {
        return {
            recent: (builder) => builder.where(
                'last_activity_at',
                '>',
                moment().subtract(20, 'minutes').format('YYYY-MM-DD HH:mm:ss')
            ),
        };
    }

    static get REMOVAL_REASONS() {
        return {
            INACTIVITY: 'INACTIVITY',
            DESERTION: 'DESERTION',
            ENDED: 'ENDED',
        }
    }

    isReady() {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return false
        }
        // todo remove
        return true
        return this.players.length === this.maxPlayers;
    }

    mapNames() {
        return this.maps.split(',').map(map => _.capitalize(map));
    }

    /**
     * Hostname
     */
    getServerName() {
        return utils.getServerNameForMatch(this)
    }

    isServerReady() {
        return utils.isServerReady(this.getServerName())
            .then(async server => {
                if (server) {
                    const createdServer = await this.setServer(server)
                    console.log('createdServer', createdServer)
                    await Match
                            .query()
                            .update({
                                server_id: createdServer.id
                            })
                            .where('id', this.id)

                    return Match.getFullMatchById(this.id)
                }

                return server
            })
    }

    cancel(reason) {
        if (reason === Match.REMOVAL_REASONS.DESERTION) {
            new DeletedMatchDueToDesertion(this)
        }

        if (reason === Match.REMOVAL_REASONS.INACTIVITY) {
            new DeletedMatchDueToInactivity(this)
        }

        if (reason === Match.REMOVAL_REASONS.ENDED) {
            new DeletedMatchDueToMatchEnding(this)
        }

        return Match
                .query()
                .update({
                    canceled_reason: reason,
                    deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                .where('id', this.id)
    }

    isServerOnline() {
        if (!this.server) {
            console.log('There is no server in the instance')
            return false
        }

        return this.server.status === 'ONLINE'
    }

    setServer(server) {
        const Server = require('./Server');
        const serverName = this.getServerName()

        return Server
            .query()
            .insertGraph({
                name: serverName,
                ip: server.serverIP,
                user_id: null,
                password: utils.getPasswordForServer(serverName),
                rcon: utils.getRconForServer(serverName),
                slots: utils.getSlotsForMatch(this),
                creation_request_at: null, // todo?
                provisioned_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: server.status,
                destroy_at: moment().add('1', 'hour').add('15', 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                destroyed_at: null,
            })
    }

    playerNames() {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return false
        }

        return this.players.map(player => player.username);
    }

    playerIds() {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return false
        }

        return this.players.map(player => player.id);
    }

    playersPerTeam() {
        return this.maxPlayers / 2;
    }

    static isPlayerInMatch(match, player) {
        return match.playerIds().includes(player.id)
    }

    static isPlayerInMatches(matches, player) {
        return matches.find(match => Match.isPlayerInMatch(match, player))
    }

    static getRecentMatchesQuery() {
        return Match.query()
            .applyFilter('recent')
            .eager('[server.providedBy, players]')
    }

    static getWaitingForPlayers() {
        return Match.getRecentMatchesQuery()
            .then(matches => matches.filter(match => match.isWaitingForPlayers()))
    }

    static getFullMatchById(id) {
        return this.query()
            .eager('[server.providedBy, players]')
            .findById(id)
    }

    join(player) {
        return Match
            .query()
            .upsertGraph({
                id: this.id,
                last_activity_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                players: [
                    {
                        id: player.id
                    }
                ]
            }, {
                insertMissing: true,
                relate: true,
                noDelete: true
            })
            .then(() => {
                const User = require('./User');

                return User
                    .query()
                    .upsertGraph({
                        id: player.id,
                        username: player.username,
                        discriminator: player.discriminator,
                        avatar: player.avatar
                    }, {
                        insertMissing: true,
                        noDelete: true
                    })
            })
            .then(() => {

            })
            .then(() => Match.getFullMatchById(this.id))
    }

    leave(player) {
        const MatchPlayer = require('./MatchPlayers');
        const wasLastPlayerInMatch = this.players.length === 1

        return MatchPlayer
            .query()
            .delete()
            .where('match_id', this.id)
            .where('user_id', player.id)
            .then(deleted => {
                if (wasLastPlayerInMatch) {
                    this.cancel(Match.REMOVAL_REASONS.DESERTION)
                }

                return deleted
            })
    }

    getChannel() {
        return bot.getClient()
            .guilds
            .find(guild => guild.id === this.guildId)
            .channels
            .find(channel => channel.id === this.channelId)
    }

    isWaitingForPlayers() {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return false
        }

        return this.players.length && this.players.length < this.maxPlayers;
    }

    static create(match, createdBy) {
        const User = require('./User');
        const MatchPlayers = require('./MatchPlayers');

        const matchData = {
            max_players: match.playersPerTeam * 2,
            server_id: null,
            maps: match.maps,
            creator_id: createdBy.id,
            last_activity_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            guild_id: match.channel.guild.id,
            channel_id: match.channel.id
        }

        return User
            .query()
            .upsertGraph({
                id: createdBy.id,
                username: createdBy.username,
                discriminator: createdBy.discriminator,
                avatar: createdBy.avatar
            }, {
                insertMissing: true,
                noDelete: true
            })
            .then(() => {
                return Match
                    .query()
                    .upsertGraph(
                        matchData,
                    {
                        insertMissing: true,
                        noDelete: true
                    })
            })
            .then(match => {
                return new Promise((resolve, reject) => {
                    MatchPlayers
                        .query()
                        .insertGraph(
                            {
                                match_id: match.id,
                                user_id: createdBy.id,
                            }
                        )
                        // return match
                        .then(() => resolve(match))
                })
            })
            .then(match => Match.getFullMatchById(match.id))
            .catch(e => {
                console.log('Failed match creation', e.stack)
            })
    }

    static relationMappings() {
        const Server = require('./Server');
        const User = require('./User');

        return {
            server: {
                relation: Model.BelongsToOneRelation,
                modelClass: Server,
                join: {
                    from: 'matches.server_id',
                    to: 'servers.id'
                }
            },
            players: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'matches.id',
                    through: {
                        from: 'match_players.match_id',
                        to: 'match_players.user_id'
                    },
                    to: 'users.id'
                }
            },
            createdBy: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'matches.creator_id',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = Match;
