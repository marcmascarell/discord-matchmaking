const DeletedMatch = require('./DeletedMatch')
const gameServerManager = require('../server/gameServerManager')

module.exports = class DeletedMatchDueToMatchEnding extends DeletedMatch {
    constructor(match) {
        match.getChannel().send(`Match finished...`)

        gameServerManager.destroy(match)

        super(match)
    }
};
