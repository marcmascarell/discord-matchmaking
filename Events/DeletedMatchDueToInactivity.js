const DeletedMatch = require('./DeletedMatch')

module.exports = class DeletedMatchDueToInactivity extends DeletedMatch {
    constructor(match) {
        match.getChannel().send(`Match inactivity...`)

        super(match)
    }
};
