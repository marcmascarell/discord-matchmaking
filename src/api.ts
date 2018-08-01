import gameServerManager from './Server/gameServerManager'
import secrets from "./secrets"
import database from "./database";
import LogProcessedActivity from "./Models/LogProcessedActivity";

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

app.get('/api/users/activity', async function (req, res) {
    const token = req.query.token

    if (token !== secrets.apiToken) {
        res.send('Invalid token!')

        return;
    }
    database.init()
    const actData = await LogProcessedActivity.query();
    console.log(actData)
    res.send({
        result: actData
    })
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})


