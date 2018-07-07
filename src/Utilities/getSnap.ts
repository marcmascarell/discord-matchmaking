import gameServerManager from "../Server/gameServerManager"

gameServerManager.getLatestSnapshot()
    .then(() => {
        process.exit(0)
    })
