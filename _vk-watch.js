const https = require('https')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 13457

app.use(bodyParser)
app.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400)
    if (!req.body.type) return res.sendStatus(400)
    if (req.body.type === 'confirmation') return res.send('a81b533d')
    // Trigger new build here
    request = https.request({ host: 'NETLIFY.WEBHOOK.HOST'
                            , method: 'POST'
                            , path: 'WEBHOOK/PATH'
                            , port: '443'
                            })
    request.end()
    return res.status(200).send('ok')
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
});
