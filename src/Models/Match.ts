const _ = require('lodash');
const moment = require('moment');

import utils from '../Utilities/utils'
import bot from '../bot'
import Model from './BaseModel'
import DeletedMatchDueToMatchEnding from '../Events/DeletedMatchDueToMatchEnding'
import DeletedMatchDueToDesertion from '../Events/DeletedMatchDueToDesertion'
import DeletedMatchDueToInactivity from '../Events/DeletedMatchDueToInactivity'
import {Channel, Guild} from "discord.js"
import MatchCreated from "../Events/MatchCreated"
import Server from "./Server"
import User from "./User"
import MatchPlayers from "./MatchPlayers"

export default class Match extends Model {
    public id : number
    public server_id : number
    public players : User[]
    public maxPlayers : number
    public maps : string
    public guildId : string
    public channelId : string
    public canceled_reason : string
    public server: Server
    public deleted_at : string
    public last_activity_at : string

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
            'playerIds',
            'playerDiscordIds',
        ];
    }

    static get namedFilters() {
        return {
            recent: (builder : any) => builder.where(
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

        return this.players.length === this.maxPlayers;
    }

    mapNames() : string[] {
        return this.maps.split(',').map((map : string) => _.capitalize(map));
    }

    /**
     * Hostname
     */
    getServerName() {
        return utils.getServerNameForMatch(this)
    }

    cancel(reason : string) {
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
                .then(response => response) // Force query execution
    }

    isServerOnline() {
        if (!this.server) {
            console.log('There is no server in the instance')
            return false
        }

        return this.server.status === 'online'
    }

    setServer(server: any) {
        const serverName = this.getServerName()

        return Server
            .query()
            .insertGraph({
                name: serverName,
                ip: server.ip,
                user_id: null,
                password: server.password,
                rcon: server.rcon,
                slots: server.slots,
                creation_request_at: null, // todo?
                provisioned_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: server.status,
                destroy_at: moment().add('1', 'hour').add('15', 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                destroyed_at: null,
            })
    }

    playerNames() : string[] {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return []
        }

        return this.players.map(player => player.discordUsername);
    }

    playerDiscordIds() : string[] {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return []
        }

        return this.players.map(player => player.discordId);
    }

    playerIds() : number[] {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return []
        }

        return this.players.map(player => player.id);
    }

    playersPerTeam() : number {
        return this.maxPlayers / 2;
    }

    static isPlayerInMatch(match : Match, player : {id: string}) : boolean {
        return utils.includes(match.playerDiscordIds(), player.id)
    }

    static isPlayerInMatches(matches : Match[], player : {id : string}) {
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

    static getFullMatchById(id : number) {
        return this.query()
            .eager('[server.providedBy, players]')
            .findById(id)
    }

    async join(player : {id: string, username: string, discriminator: string, avatar: string}) {
        const user = await User.upsertByDiscordId(player.id, player)

        const query : any = {
            id: this.id,
            last_activity_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            players: [
                {
                    id: user.id
                }
            ]
        }

        return await Match
            .query()
            .upsertGraph(query,
                {
                    insertMissing: true,
                    relate: true,
                    noDelete: true
                }
            )
            .then(() => Match.getFullMatchById(this.id))
    }

    async leave(player : {id: string}) {
        const wasLastPlayerInMatch = this.players.length === 1

        const user = await User.findByDiscordId(player.id)

        return MatchPlayers
            .query()
            .delete()
            .where('match_id', this.id)
            .where('user_id', user.id)
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
            .find((guild : Guild) => guild.id === this.guildId)
            .channels
            .find((channel : Channel) => channel.id === this.channelId)
    }

    isWaitingForPlayers() {
        if (!this.players) {
            console.log('No players given... did you load the relation?')
            return false
        }

        return this.players.length && this.players.length < this.maxPlayers;
    }

    static async create(match : any, createdBy : any) {
        const matchData = {
            max_players: match.maxPlayers,
            maps: match.maps,
            creator_id: createdBy.id,
            last_activity_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            guild_id: match.channel.guild.id,
            channel_id: match.channel.id
        }

        const user = await User.upsertByDiscordId(createdBy.id, createdBy)

        return Match
            .query()
            .upsertGraph(
                matchData,
            {
                insertMissing: true,
                noDelete: true
            })
            .then((match : Match) => {
                return new Promise((resolve) => {
                    MatchPlayers
                        .query()
                        .insertGraph(
                            {
                                match_id: match.id,
                                user_id: user.id,
                            }
                        )
                        // return match
                        .then(() => resolve(match))
                })
            })
            .then((match : Match) => Match.getFullMatchById(match.id))
            .then((match : Match) => {
                new MatchCreated({match})

                return match
            })
            .catch(e => {
                console.log('Failed match creation', e.stack)
            })
    }

    static relationMappings() {
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
