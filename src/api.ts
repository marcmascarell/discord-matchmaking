import gameServerManager from './Server/gameServerManager'
import secrets from "./secrets"

const express = require('express')
const app = express()
const port = 5001

app.get('/', (request, response) => {
    response.send('Hello from Express!')
})

app.post('/api/server/create', function (req, res) {
    const token = req.query.token
    const map = req.query.map || 'carentan'
    const slots = req.query.slots || 12
    const name = req.query.name || `Server-${+ new Date()}`

    if (token !== secrets.apiToken) {
        res.send('Invalid token!')

        return;
    }

    gameServerManager.create(name, {
        maps: [map],
        slots: slots,
    })

    res.send({
        creating: name,
        result: 'ok'
    })
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})


