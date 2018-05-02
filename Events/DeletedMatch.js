module.exports = class DeletedMatch {
    constructor(match) {
        let message = `Deleting match ${match.id}...`

        if (match.players.length) {
            message += ' **Affected players: `' + match.playerNames().join(', ') + '`**'
        }

        match.getChannel().send(message)
    }
};
