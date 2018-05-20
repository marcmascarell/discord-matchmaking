const express = require('express')
const app = express()
const port = 5001

app.get('/', (request, response) => {
    response.send('Hello from Express!')
})

// app.get('/api/choice', function (req, res) {
//     console.log('id: ' + req.query.id);
//
//     gameServerManager.create(`Custom-Server`, {
//         maps: ['carentan'],
//         slots: 4,
//     })
// });

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})


