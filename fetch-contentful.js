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

function parseNews(itemfields) {
// {{{
var newNews = {}
newNews.layout = 'post'
newNews.id = itemfields.id.toString()
newNews.post = itemfields.id.toString()
newNews.permalink = `/news/${itemfields.id.toString()}/`
newNews.title = itemfields.title
newNews.summary = itemfields.summary
newNews.imgasset = itemfields.image.fields.file.url
newNews.image = itemfields.image.fields.file.fileName
newNews.body = itemfields.content
return newNews
// }}}
}
// }}}
// Fetch tours {{{
function fetchTours() {
    var toursCatalogue = {}
    var entriesCount = 0
    client.getEntries({
        'content_type': 'tour'
    })
        .then((entries) => {
            for (const item of entries.items) {
                var newTour = {}
                newTour.layout = 'tour'
                newTour.id = item.fields.tour.toString()
                newTour.tour = item.fields.tour.toString()
                newTour.permalink = `/tours/${item.fields.tour.toString()}/`
                newTour.hidden = item.fields.hidden
                newTour.title = item.fields.title
                newTour.subtitle = item.fields.subtitle || ''
                newTour.intro = item.fields.intro
                newTour.summary = item.fields.summary || ''
                newTour.length = item.fields.length
                newTour.tourlength = item.fields.length
                newTour.imgasset = item.fields.imgasset.fields.file.url
                newTour.imgpath = item.fields.imgasset.fields.file.fileName

                newTour.tourdate = 'по заказу'
                newTour.prices = ['уточняйте при заказе']
                newTour.blueprint = []
                newTour.includes = []
                newTour.additionalFees = []
                newTour.willLearn = []
                newTour.details = []

                if (item.fields.dates) { newTour.tourdate = item.fields.dates[0] }
                if (item.fields.prices) { newTour.prices = deMd(item.fields.prices) }
                if (item.fields.blueprint) { newTour.blueprint = deMd(item.fields.blueprint) }
                if (item.fields.includes) { newTour.includes = deMd(item.fields.includes) }
                if (item.fields.additionalFees) { newTour.additionalFees = deMd(item.fields.additionalFees) }
                if (item.fields.willLearn) { newTour.willLearn = deMd(item.fields.willLearn) }
                if (item.fields.details) { newTour.details = item.fields.details.split(' \n\n ') }

                saveCollection(newTour, '_tours')
                entriesCount += 1
                toursCatalogue[newTour.id] = newTour
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


    client.getEntries({
        'content_type': 'news'
    })
        .then((entries) => {
            for (const item of entries.items) {
                const newsItem = parseNews(item.fields)
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
