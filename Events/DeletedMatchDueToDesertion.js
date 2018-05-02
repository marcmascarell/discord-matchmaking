const DeletedMatch = require('./DeletedMatch')

module.exports = class DeletedMatchDueToDesertion extends DeletedMatch {
    constructor(match) {
        match.getChannel().send(`Match desertion...`)

        super(match)
    }
};
