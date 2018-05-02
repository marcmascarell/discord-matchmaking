const secrets = {
    passwordSalt: '',
    rconSalt: '',
    discordOwner: '',
    discordToken: '',
    digitalOceanToken: '',
    jsonStore: '',
}

secrets.discordAdmins = [
    secrets.discordOwner
]
secrets.discordModerators = []

module.exports = secrets
