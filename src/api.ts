import gameServerManager from './Server/gameServerManager'
import secrets from "./secrets"
import database from "./database";
import LogProcessedActivity from "./Models/LogProcessedActivity";
import cors from "cors"
const moment = require('moment');

const express = require('express')
const app = express()
const port = 5001

app.use(cors())
app.options("*" , cors())

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
    const date = req.query.date
    let momentDate

    if (date) {
        momentDate = moment(date,'DD-MM-YYYY')
    } else{
        momentDate = moment()
    }

    if (token !== secrets.apiToken) {
        res.send('Invalid token!')

        return;
    }

    database.init()

    const actData = await LogProcessedActivity
        .query()
        .whereBetween('created_at', [
            momentDate.subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
            momentDate.format('YYYY-MM-DD HH:mm:ss')
        ])

    console.log(actData)
    res.send(
        // {
        //     "result": [
        //         {
        //             "online": "1015,1016,123",
        //             "playing": "123",
        //             "onlineAt": "2018-07-23 19:00:00",
        //             "createdAt": "2018-07-23 19:28:06",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015",
        //             "playing": "1016",
        //             "onlineAt": "2018-08-08 18:00:00",
        //             "createdAt": "2018-08-08 18:27:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015",
        //             "playing": "1016",
        //             "onlineAt": "2018-08-08 19:00:00",
        //             "createdAt": "2018-08-08 19:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,15,19,36,15,23,95",
        //             "playing": "1016,541",
        //             "onlineAt": "2018-08-08 20:00:00",
        //             "createdAt": "2018-08-08 20:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54",
        //             "playing": "1016,4485,2358,9479",
        //             "onlineAt": "2018-08-08 21:00:00",
        //             "createdAt": "2018-08-08 21:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54,1015,51,356,54",
        //             "playing": "1015,51,356,54",
        //             "onlineAt": "2018-08-22 19:00:00",
        //             "createdAt": "2018-08-22 19:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54",
        //             "playing": "1015,51,356",
        //             "onlineAt": "2018-08-22 20:00:00",
        //             "createdAt": "2018-08-22 20:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54",
        //             "playing": "1015,51,356,54",
        //             "onlineAt": "2018-08-22 21:03:52",
        //             "createdAt": "2018-08-22 21:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54,1015,51,356",
        //             "playing": "1016,1015,51,356,54",
        //             "onlineAt": "2018-08-22 22:03:52",
        //             "createdAt": "2018-08-22 22:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54,1015,51,356,54,1015,51,356,54",
        //             "playing": "1015,51,356,54",
        //             "onlineAt": "2018-08-22 23:03:52",
        //             "createdAt": "2018-08-22 23:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54",
        //             "playing": "1015,51,356,54",
        //             "onlineAt": "2018-08-22 00:03:52",
        //             "createdAt": "2018-08-22 00:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51",
        //             "playing": "1016",
        //             "onlineAt": "2018-08-22 18:03:52",
        //             "createdAt": "2018-08-22 18:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54",
        //             "playing": "1016",
        //             "onlineAt": "2018-08-22 17:03:52",
        //             "createdAt": "2018-08-22 17:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,356,54",
        //             "playing": "",
        //             "onlineAt": "2018-08-22 11:03:52",
        //             "createdAt": "2018-08-22 11:03:52",
        //             "updatedAt": null
        //         },
        //         {
        //             "online": "1015,51,54",
        //             "playing": "1016",
        //             "onlineAt": "2018-08-22 12:03:52",
        //             "createdAt": "2018-08-22 12:03:52",
        //             "updatedAt": null
        //         }
        //     ]
        // }
              {
        result: actData
    }
    )
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})


