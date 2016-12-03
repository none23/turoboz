// Deps {{{
const fs = require('fs')
const fetch = require('node-fetch')
const contentful = require('contentful')
const yaml = require('js-yaml')
const assert = require('assert')
// }}}
const accessToken = require('./.contentful-accessToken.json')
const space = 'x9tc47a70skr'
const client = contentful.createClient({accessToken, space})
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
  let frontMatter = yaml.dump(objectToSave)
  let collectionFile = `---
${frontMatter}
---
`
  let filename = `./${collectionDir}/${objectToSave.id}.md`
  fs.writeFile(filename, collectionFile, 'utf8', function (err) {
    if (err) { throw err } else { console.log(`written ${filename}`) }
  })
}

function tagIndexMD (tag) {
  return `---
layout: tours
title: ${tag.pageTitle}
description: >-
  ${tag.description}

menucopy: ${tag.menuCopy}
text: >-
  ${tag.text}

permalink: ${tag.url}
---
`
}
// }}}
// Fetch tags {{{
function fetchTags () {
  client.getEntries({
    'content_type': 'tourTag'
  })
    .then(entries => {
      return entries
    })
    .then(entries => {
      let tagsData = []

      for (let item of entries.items) {
        let newTag = {}

        newTag.tag = item.fields.id
        newTag.text = item.fields.text ? item.fields.text : ''
        newTag.url = `/tours/${newTag.tag}/`
        newTag.description = item.fields.pageDescription
        newTag.pageTitle = item.fields.pageTitle
        newTag.menuCopy = item.fields.title

        if (item.fields.subtags) {
          newTag.subtags = []

          for (let st of item.fields.subtags) {
            let newSubtag = {}

            newSubtag.subtag = st.fields.id
            newSubtag.description = st.fields.pageDescription ? st.fields.pageDescription : ''
            newSubtag.pageTitle = st.fields.pageTitle
            newSubtag.menuCopy = st.fields.title
            newSubtag.text = st.fields.text
            newSubtag.url = `/tours/${item.fields.abbreviation}/${st.fields.abbreviation}/`

            newTag.subtags.push(newSubtag)
          }
        }

        if (!item.fields.isSubtag) { tagsData.push(newTag) }
      }

      return tagsData
    })

    .then(tagsData => {
      for (let tag of tagsData) {
        if (!fs.existsSync(`.${tag.url}`)) {
          fs.mkdirSync(`.${tag.url}`)
        }

        let tagIndex = `.${tag.url}index.html`
        let tagIndexContent = tagIndexMD(tag)

        fs.writeFile(tagIndex, tagIndexContent, 'utf8', function (err) {
          if (err) { throw err } else { console.log(`written ${tagIndex}`) }
        })

        if (tag.subtags) {
          for (let subtag of tag.subtags) {
            if (!fs.existsSync(`.${subtag.url}`)) {
              fs.mkdirSync(`.${subtag.url}`)
            }

            let subtagIndex = `.${subtag.url}index.html`
            let subtagIndexContent = tagIndexMD(subtag)

            fs.writeFile(subtagIndex, subtagIndexContent, 'utf8', function (err) {
              if (err) { throw err } else { console.log(`written ${subtagIndex}`) }
            })
          }
        }
      }
      return tagsData
    })

    .then(tagsData => {
      let filename = './_data/tags.json'
      fs.writeFile(filename, JSON.stringify(tagsData), 'utf8', function (err) {
        if (err) { throw err } console.log(`written ${filename}`)
      })
    })

    .catch(err => {
      throw err
    })
}
// }}}
// Fetch tours {{{
function fetchTours () {
  client.getEntries({
    'content_type': 'tour'
  })
    .then(entries => {
      return entries
    })
    .then(entries => {
      let toursData = {}
      let entriesCount = 0
      let toursAssets = []
      let upcomingTours = []
      let response = {}

      for (let item of entries.items) {
        let newTour = {}

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
        newTour.tourlastdate = item.fields.dates && item.fields.dates[1] ? `${item.fields.dates[item.fields.dates.length - 1]}` : '00.00.0000'
        newTour.prices = item.fields.prices ? item.fields.prices.split('* ').slice(1) : ['уточняйте при заказе']
        newTour.blueprint = item.fields.blueprint ? item.fields.blueprint.split('* ').slice(1) : []
        newTour.includes = item.fields.includes ? item.fields.includes.split(' * ').slice(1) : []
        newTour.additionalFees = item.fields.additionalFees ? item.fields.additionalFees.split('* ').slice(1) : []
        newTour.willLearn = item.fields.willLearn ? item.fields.willLearn.split('* ').slice(1) : []
        newTour.details = item.fields.details ? item.fields.details.split('\n\n') : []

        toursData[newTour.id] = newTour
        entriesCount += 1
        saveCollection(newTour, '_tours')
        toursAssets.push([newTour.imgasset, newTour.imgpath])

        if (newTour.tourdate !== '00.00.0000') {
          let jsDate = Date.parse(newTour.tourdate.split('.').reverse().join('-'))
          if (jsDate > Date.now()) {
            upcomingTours.push([newTour.id, jsDate])
          }
        }
      }

      response.upcomingTours = upcomingTours
      response.toursData = toursData
      response.toursAssets = toursAssets
      response.entriesCount = entriesCount

      return response
    })

    .then(response => {
      let filename = './_data/tours.json'

      assert.equal(response.entriesCount, Object.keys(response.toursData).length)

      fs.writeFile(filename, JSON.stringify(response.toursData), 'utf8', function (err) {
        if (err) { throw err } else { console.log(`written ${filename}`) }
      })

      return response
    })

    .then(response => {
      let filename = './_data/upcoming.json'
      let upcomingPairs = response.upcomingTours.sort((a, b) => {
        return a[1] - b[1]
      })
      let upcomings = upcomingPairs.map(pair => {
        return pair[0]
      })

      fs.writeFile(filename, JSON.stringify(upcomings.slice(0, 4)), 'utf8', function (err) {
        if (err) { throw err } else { console.log(`written ${filename}`) }
      })

      return response
    })

    .then(response => {
      response.toursAssets.map(tourLinksPair => {
        let filename = './img/_tours/' + tourLinksPair[1]
        let remoteFile = 'http:' + tourLinksPair[0]
        fetch(remoteFile)
          .then(res => {
            let localFile = fs.createWriteStream(filename)
            res.body.pipe(localFile)
            console.log(`written ${filename}`)
          })
          .catch(err => {
            throw err
          })
      })
    })

    .catch(err => {
      throw err
    })
}
// }}}
// Fetch news {{{

function fetchNews () {
  client.getEntries({
    'content_type': 'news'
  })
    .then(entries => {
      return entries
    })
    .then(entries => {
      let newsData = {}
      let entriesCount = 0
      let newsAssets = []
      let response = {}

      for (let item of entries.items) {
        let newNews = {}
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

        newsData[newNews.id] = newNews
        entriesCount += 1
        saveCollection(newNews, '_news')
        newsAssets.push([newNews.imgasset, newNews.image])
      }

      response.newsData = newsData
      response.newsAssets = newsAssets
      response.entriesCount = entriesCount

      return response
    })
    .then(response => {
      let filename = './_data/newsposts.json'
      assert.equal(response.entriesCount, Object.keys(response.newsData).length)
      fs.writeFile(filename, JSON.stringify(response.newsData), 'utf8', function (err) {
        if (err) { throw err }
        console.log(`written ${filename}`)
      })
      return response
    })

    .then(response => {
      response.newsAssets.map(newsLinksPair => {
        let filename = './img/_posts/' + newsLinksPair[1]
        let remoteFile = 'http:' + newsLinksPair[0]
        fetch(remoteFile)
          .then(res => {
            let localFile = fs.createWriteStream(filename)
            res.body.pipe(localFile)
            console.log(`written ${filename}`)
          })
          .catch(err => {
            throw err
          })
      })
    })

    .catch(err => {
      throw err
    })
}
// }}}
// Fetch testim {{{

function fetchTestim () {
  client.getEntries({
    'content_type': 'testimonial'
  })
    .then(entries => {
      return entries
    })

    .then(entries => {
      let testimData = []
      let entriesCount = 0
      let response = {}

      for (let item of entries.items) {
        let newTestim = {}

        newTestim.date = item.fields.date
        newTestim.author = item.fields.author
        newTestim.message = item.fields.message
        newTestim.dateId = item.fields.date.split('.').reverse().join('_')

        testimData.push(newTestim)
        entriesCount += 1
      }

      response.testimData = testimData
      response.entriesCount = entriesCount

      return response
    })

    .then(response => {
      let filename = './_data/testimonials.yml'

      assert.equal(response.entriesCount, response.testimData.length)
      fs.writeFile(filename, yaml.safeDump(response.testimData), function (err) {
        if (err) { throw err } else { console.log(`written ${filename}`) }
      })
    })

    .catch(err => {
      throw err
    })
}
// }}}

;(() => {
  const args = process.argv.map(stripArgDash).slice(2)

  if (!process.env.DOCKER) {
    assert.notEqual(process.cwd().indexOf('turoboz'), -1)
  }

  if (args) {
    args.forEach(arg => {
      switch (arg) {
        case 'tags':
          fetchTags()
          break

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
    fetchTags()
    fetchTours()
    fetchNews()
    fetchTestim()
  }
})()
