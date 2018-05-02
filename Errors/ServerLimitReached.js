module.exports = class ServerLimitReached extends Error {
    constructor() {
        super('Server limit reached')
    }
};
