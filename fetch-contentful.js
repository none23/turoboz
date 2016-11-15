// Deps {{{
const fs = require('fs')
const fetch = require('node-fetch')
const contentful = require('contentful')
const yaml = require('js-yaml')
const assert = require('assert')
// }}}
const accessToken = require('./.contentful-accessToken.json')
const space = 'x9tc47a70skr'
// Setup {{{

const client = contentful.createClient({accessToken, space})
/*
const rmMd = require('remove-markdown')
const deMd = (ulMd) => {
  rmMd(ulMd.replace(' *', '*')).split('\n ')
}
*/

// }}}
// Utils {{{

function stripArgDash (arg) {
  if (arg[0] === '-') {
    if (arg[1] === '-') {
      return arg.slice(2)
    }
    return arg.slice(1)
  }
  return arg
}

function saveCollection (objectToSave, collectionDir) {
  const frontMatter = yaml.dump(objectToSave)
  const collectionFile = `---
${frontMatter}
---
`
  const filename = `./${collectionDir}/${objectToSave.id}.md`
  fs.writeFile(filename, collectionFile, 'utf8', function (err) {
    if (err) { throw err }
    console.log(`written ${filename}`)
  })
}

// }}}
// Fetch tours {{{

function fetchTours () {
  var toursCatalogue = {}
  var upcomingTours = []
  var toursAssets = []
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
        newTour.tags = item.fields.tags
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

        newTour.tourdate = item.fields.dates ? `${item.fields.dates[0]}` : '00.00.0000'
        newTour.tourlastdate = item.fields.dates ? `${item.fields.dates[-1]}` : newTour.tourdate
        newTour.prices = item.fields.prices ? item.fields.prices.split('* ').slice(1) : ['уточняйте при заказе']
        newTour.blueprint = item.fields.blueprint ? item.fields.blueprint.split('* ').slice(1) : []
        newTour.includes = item.fields.includes ? item.fields.includes.split(' * ').slice(1) : []
        newTour.additionalFees = item.fields.additionalFees ? item.fields.additionalFees.split('* ').slice(1) : []
        newTour.willLearn = item.fields.willLearn ? item.fields.willLearn.split('* ').slice(1) : []
        newTour.details = item.fields.details ? item.fields.details.split('\n\n') : []
        /*
        // newTour.prices = item.fields.prices ? deMd(item.fields.prices) : ['уточняйте при заказе']
        // newTour.blueprint = item.fields.blueprint ? deMd(item.fields.blueprint) : []
        // newTour.includes = item.fields.includes ? deMd(item.fields.includes) : []
        // newTour.additionalFees = item.fields.additionalFees ? deMd(item.fields.additionalFees) : []
        // newTour.willLearn = item.fields.willLearn ? deMd(item.fields.willLearn) : []
        */

        entriesCount += 1
        saveCollection(newTour, '_tours')
        toursAssets.push([newTour.imgasset, newTour.imgpath])
        toursCatalogue[newTour.id] = newTour

        // Save the image
        // TODO fs.writeFile(`./img/_tours/${newTour.imgpath}`, JSON.stringify(upcomings.slice(0, 4)), 'utf8', function (err) {

        if (newTour.tourdate !== '00.00.0000') {
          var jsDate = Date.parse(newTour.tourdate.split('.').reverse().join('-'))
          if (jsDate > Date.now()) {
            upcomingTours.push([newTour.id, jsDate])
          }
        }
      }
    })
    .then(() => {
      const filename = './_data/upcoming.json'
      const upcomingPairs = upcomingTours.sort(function (a, b) {
        return a[1] - b[1]
      })
      var upcomings = upcomingPairs.map(function (pair) {
        return pair[0]
      })
      fs.writeFile(filename, JSON.stringify(upcomings.slice(0, 4)), 'utf8', function (err) {
        if (err) { throw err }
        console.log(`written ${filename}`)
      })
    })
    .then(() => {
      const filename = './_data/tours.json'
      assert.equal(entriesCount, Object.keys(toursCatalogue).length)
      fs.writeFile(filename, JSON.stringify(toursCatalogue), 'utf8', function (err) {
        if (err) { throw err }
        console.log(`written ${filename}`)
      })
    })
    .then(() => {
      for (const tourLinksPair of toursAssets) {
        const localFile = './img/_tours/' + tourLinksPair[1]
        const remoteFile = 'http:' + tourLinksPair[0]
        fetch(remoteFile)
          .then(function (res) {
            var dest = fs.createWriteStream(localFile)
            res.body.pipe(dest)
          })
      }
    })
}
// }}}
// Fetch news {{{

function fetchNews () {
  var newsCatalogue = {}
  var newsAssets = []
  var entriesCount = 0

  client.getEntries({
    'content_type': 'news'
  })
    .then((entries) => {
      for (const item of entries.items) {
        var newNews = {}
        newNews.layout = 'post'
        newNews.id = item.fields.id.toString()
        newNews.post = item.fields.id.toString()
        newNews.permalink = `/news/${item.fields.id.toString()}/`
        newNews.title = item.fields.title
        newNews.summary = item.fields.summary
        newNews.dateposted = item.fields.dateposted.split('-').reverse().join('.').toString()
        newNews.imgasset = item.fields.image.fields.file.url
        newNews.image = item.fields.image.fields.file.fileName
        newNews.body = item.fields.content

        entriesCount += 1
        saveCollection(newNews, '_news')
        newsAssets.push([newNews.imgasset, newNews.image])
        newsCatalogue[newNews.id] = newNews
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
    .then(() => {
      for (const newsLinksPair of newsAssets) {
        const localFile = './img/_posts/' + newsLinksPair[1]
        const remoteFile = 'http:' + newsLinksPair[0]
        fetch(remoteFile)
          .then(function (res) {
            var dest = fs.createWriteStream(localFile)
            res.body.pipe(dest)
          })
      }
    })
}
// }}}
// Fetch testim {{{

function fetchTestim () {
  var testimCatalogue = []
  var entriesCount = 0

  client.getEntries({
    'content_type': 'testimonial'
  })
    .then((entries) => {
      for (const item of entries.items) {
        var newTestim = {}
        newTestim.date = item.fields.date
        newTestim.author = item.fields.author
        newTestim.message = item.fields.message
        newTestim.dateId = item.fields.date.split('.').reverse().join('_')

        entriesCount += 1
        testimCatalogue.push(newTestim)
      }
    })
    .then(() => {
      const filename = './_data/testimonials.yml'
      assert.equal(entriesCount, testimCatalogue.length)
      fs.writeFile(filename, yaml.safeDump(testimCatalogue), function (err) {
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
