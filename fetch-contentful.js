// Deps {{{
const fs = require('fs')
const contentful = require('contentful')
const rmMd = require('remove-markdown')
const yaml = require('js-yaml')
const assert = require('assert')
// }}}
const accessToken = require('./.contentful-accessToken.json')
const space = 'x9tc47a70skr'
// Setup {{{
const client = contentful.createClient({
    accessToken,
    space
})
const deMd = (ulMd) =>  {
    rmMd( ulMd.replace(' *', '*')).split('\n ')
}
// }}}
// Utils {{{
function stripArgDash(arg) {
    if (arg[0] === '-') {
        if (arg[1] === '-') {
            return arg.slice(2)
        }
        return arg.slice(1)
    }
    return arg
}

function saveCollection(objectToSave, collectionDir) {
    const frontMatter = yaml.dump(objectToSave)
    const collectionFile = `---\n${frontMatter}\n---\n`
    const filename = `./${collectionDir}/${objectToSave.id}.md`
    fs.writeFile(filename, collectionFile, 'utf8', function (err) {
        if (err) { throw err }
        console.log(`written ${filename}`)
    })
}
// }}}
// Fetch tours {{{
function fetchTours() {
    var toursCatalogue = {}
    var entriesCount = 0

    class Tour {
        // {{{
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
        // }}}
    }

    client.getEntries({
        'content_type': 'tour'
    })
        .then((entries) => {
            for (const item of entries.items) {
                const tourItem = new Tour(item.fields)
                entriesCount += 1
                saveCollection(tourItem, '_tours')
                toursCatalogue[tourItem.id] = tourItem
            }
        })
            .then(() => {
                const filename = './_data/tours.json'

                assert.equal(entriesCount, Object.keys(toursCatalogue).length)
                fs.writeFile(filename, JSON.stringify(toursCatalogue), 'utf8', function (err) {
                    if (err) { throw err }
                    console.log(`written ${filename}`)
                })
            })
}
// }}}
// Fetch news {{{
function fetchNews() {
    var newsCatalogue = {}
    var entriesCount = 0

    class Newspost {
        // {{{
        constructor(item) {
            this.layout = 'post'
            this.id = item.id.toString()
            this.post = item.id.toString()
            this.permalink = `/news/${item.id.toString()}/`
            this.title = item.title
            this.summary = item.summary
            this.imgasset = item.image.fields.file.url
            this.image = item.image.fields.file.fileName
            this.body = item.content
        }
        // }}}
    }

    client.getEntries({
        'content_type': 'news'
    })
        .then((entries) => {
            for (const item of entries.items) {
                const newsItem = new Newspost(item.fields)
                entriesCount += 1
                saveCollection(newsItem, '_news')
                newsCatalogue[newsItem.id] = newsItem
            }
        })
            .then(() => {
                const filename = './_data/newsposts.json'
                assert.equal(entriesCount, Object.keys(newsCatalogue).length)
                fs.writeFile(filename, JSON.stringify(newsCatalogue), 'utf8', function (err) {
                    if (err) { throw err }
                    console.log(`written ${filename}`)
                })
            })
}
// }}}
// Fetch testim {{{
function fetchTestim() {
    var testimCatalogue = []
    var entriesCount = 0

    class Testim {
        // {{{
        constructor(item) {
            this.date = item.date
            this.author = item.author
            this.message = item.message
        }
        // }}}
    }

    client.getEntries({
        'content_type': 'testimonial'
    })
        .then((entries) => {
            for (const item of entries.items) {
                const testimItem = new Testim(item.fields)
                entriesCount += 1
                testimCatalogue.push(testimItem)
            }
        })
            .then(() => {
                const filename = './_data/testimonials.json'
                assert.equal(entriesCount, testimCatalogue.length)
                fs.writeFile(filename, JSON.stringify(testimCatalogue), 'utf8', function (err) {
                    if (err) { throw err }
                    console.log(`written ${filename}`)
                })
            })
}
// }}}

(() => {
    const args = process.argv.map(stripArgDash).slice(2)
    if (!process.env.DOCKER) { assert.notEqual(process.cwd().indexOf('turoboz'), -1) } 
    if (args) {
        args.forEach(function (arg) {
            switch (arg) {
            case 'tours':
                fetchTours()
                break
            case 'news':
                fetchNews()
                break
            case 'testim':
                fetchTestim()
                break
            default:
                throw new Error(`Unknown argument: '${arg}'`)
            }
        })
    } else {
        fetchTours()
        fetchNews()
        fetchTestim()
    }
})()
