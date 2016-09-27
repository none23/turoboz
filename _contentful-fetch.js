const contentful = require('contentful')
const util = require('util')

const accessToken = require('./_contentful_accessToken.json')
const space = 'x9tc47a70skr'

const client = contentful.createClient({
    accessToken,
    space
})
const fetchTours = client.getEntries({
    'content_type': 'tour'
})
    .then((entries) => {
        console.log(entries.items[0].fields)
        console.log(entries.items[0].fields.imgasset)
    })
