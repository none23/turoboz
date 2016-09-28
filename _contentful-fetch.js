const fs = require('fs')
const contentful = require('contentful')
const rmMd = require('remove-markdown')
const yaml = require('js-yaml')

const deMd = (ulMd) =>  {
    rmMd( ulMd.replace(' *', '*')).split('\n ')
}

const accessToken = require('./_contentful_accessToken.json')
const space = 'x9tc47a70skr'

const client = contentful.createClient({
    accessToken,
    space
})

function saveCollection(objectToSave, collectionDir) {
    const frontMatter = yaml.dump(objectToSave)
    const collectionFile = `---\n${frontMatter}\n---\n`
    const filename = `./${collectionDir}/${objectToSave.id}.md`
    fs.writeFile(filename, collectionFile, 'utf8', function(err) {
        if (err) { throw err }
        console.log(`written ${filename}`)
    })
}

function fetchPosts() {
// {{{
    class Newspost {
        constructor(item) {
            this.layout = 'post'
            this.id = item.id.toString()
            this.post = item.id.toString()
            this.permalink = `/news/${item.id.toString()}/`
            this.title = item.title
            this.summary = item.summary
            this.imgasset = item.image.fields.file.url
            this.imgpath = item.image.fields.file.fileName
            this.body = item.content
        }
    }

    var newsCatalogue = {}

    client.getEntries({
        'content_type': 'news'
    })
        .then((entries) => {
            const items = entries.items
            for (const itemObj of items) {
                const item = itemObj.fields

                const newsItem = new Newspost(item)

                saveCollection(newsItem, '_news')
                newsCatalogue[newsItem.id] = newsItem
            }
        })
            .then(() => {
                const filename = './_data/newsposts.json'

                fs.writeFile(filename, JSON.stringify(newsCatalogue), 'utf8', function(err) {
                    if (err) { throw err }
                    console.log(`written ${filename}`)
                })
            })
}
// }}}

function fetchTours() {
// {{{
    class Tour {
        constructor(item) {
            this.layout = 'tour'
            this.id = item.tour.toString()
            this.tour = item.tour.toString()
            this.permalink = `/tours/${item.tour.toString()}/`
            this.hidden = item.hidden
            this.title = item.title
            this.subtitle = item.subtitle || ''
            this.intro = item.intro
            this.summary = item.summary || ''
            this.length = item.length
            this.tourlength = item.length
            this.imgasset = item.imgasset.fields.file.url
            this.imgpath = item.imgasset.fields.file.fileName

            if (item.dates) {
                this.tourdate = item.dates[0]
            } else {
                this.tourdate = 'по заказу'
            }

            if (item.prices) {
                this.prices = deMd(item.prices)
            } else {
                this.prices = ['уточняйте при заказе']
            }

            if (item.blueprint) {
                this.blueprint = deMd(item.blueprint)
            } else {
                this.blueprint = []
            }

            if (item.includes) {
                this.includes = deMd(item.includes)
            } else {
                this.includes = []
            }

            if (item.additionalFees) {
                this.additionalFees = deMd(item.additionalFees)
            } else {
                this.additionalFees = []
            }

            if (item.willLearn) {
                this.willLearn = deMd(item.willLearn)
            } else {
                this.willLearn = []
            }

            if (item.details) {
                this.details = item.details.split(' \n\n ')
            } else {
                this.details = []
            }
        }
    }

    var toursCatalogue = {}

    client.getEntries({
        'content_type': 'tour'
    })
        .then((entries) => {
            const items = entries.items
            for (const itemObj of items) {
                const item = itemObj.fields

                const tourItem = new Tour(item)
                saveCollection(tourItem, '_tours')
                toursCatalogue[tourItem.id] = tourItem
            }
        })
            .then(() => {
                const filename = './_data/tours.json'

                fs.writeFile(filename, JSON.stringify(toursCatalogue), 'utf8', function(err) {
                    if (err) { throw err }
                    console.log(`written ${filename}`)
                })
            })
}
// }}}

function fetchTestimonials() {
// {{{
    class Testimonial {
        constructor(item) {
            this.date = item.date
            this.author = item.author
            this.message = item.message
        }
    }

    var testimCatalogue = []

    client.getEntries({
        'content_type': 'testimonial'
    })
        .then((entries) => {
            console.log(entries)
            const items = entries.items
            for (const itemObj of items) {
                const item = itemObj.fields

                const testimItem = new Testimonial(item)
                testimCatalogue.push(testimItem)
            }
        })
            .then(() => {
                const filename = './_data/testimonials.json'

                fs.writeFile(filename, JSON.stringify(testimCatalogue), 'utf8', function(err) {
                    if (err) { throw err }
                    console.log(`written ${filename}`)
                })
            })
}
// }}}


(() => {
    fetchPosts()
    fetchTours()
    fetchTestimonials()
})()
