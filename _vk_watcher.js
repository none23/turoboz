const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const port = 8888

app.post('/', jsonParser, (request, response) => {
    if (!request.body) {
        return response.sendStatus(400)
    } 
    if (!request.body.type){
        return response.sendStatus(400)
    } else if (request.body.type === 'confirmation') {
        return response.send('a81b533d')
    } 
    console.log(`got a request: ${request.body.object}`)

    return response.status(200).send('ok')
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
});
