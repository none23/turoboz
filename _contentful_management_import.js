const fs = require('fs')
const contentful = require('contentful-management')
const localTours = require('./_data/tours.json')
const localTestims = require('./_data/testimonials.json')

const accessToken = require('./_contentful_management_accessToken.json')
const spaceId = 'x9tc47a70skr'

const client = contentful.createClient({accessToken})

const createTestimEntry = (space, testimObj) => {
    space.createEntry('testimonial', testimObj)
}

const createTourEntry = (space, id, tourObj) => {
    space.createEntryWithId('tour', id, tourObj)
    .then((e) => console.log(e))
}

const rebuildTestim = (oldTestim) => {
    const newTestimFields = {
        "author": {
            "ru-RU": oldTestim.author
        },
        "date": {
            "ru-RU": oldTestim.date
        },
        "message": {
            "ru-RU": oldTestim.testimonial.join('\n\n')
        }
    }
    const newTestim = {
        "fields": newTestimFields
    }
    return JSON.stringify(newTestim)
}

const rebuild = (oldTourId, oldTour) => {
    const newTourFields = {
        "imgasset": {
            "ru-RU": {
                "sys": {
                    "id": oldTour.imgpath,
                    "linkType": "Asset",
                    "type": "Link"
                }
            }
        },
        "intro": {
            "ru-RU": oldTour.intro
        },
        "length": {
            "ru-RU": oldTour.tourlength
        },
        "subtitle": {
            "ru-RU": oldTour.subtitle
        },
        "summary": {
            "ru-RU": oldTour.summary
        },
        "tags": {
            "ru-RU": oldTour.tags
        },
        "title": {
            "ru-RU": oldTour.title
        },
        "tour": {
            "ru-RU": Number(oldTourId)
        }
    }

    if (oldTour.hidden) {
        newTourFields.hidden = {
            "ru-RU": true
        }
    } else {
        newTourFields.hidden = {
            "ru-RU": false
        }
    }

    if (oldTour.additionalFees[0]) {
        newTourFields.additionalFees = {
            "ru-RU": ` * ${oldTour.additionalFees.join('\n * ')}`
        }
    }

    if (oldTour.dates[0]) {
        newTourFields.dates = {
            "ru-RU": oldTour.dates
        }
    }

    if (oldTour.prices[0] !== "уточняйте при заказе") {
        newTourFields.prices = {
            "ru-RU": ` * ${oldTour.prices.join('\n * ')}`
        }
    }

    if (oldTour.blueprint[0]) {
        newTourFields.blueprint = {
            "ru-RU": ` * ${oldTour.blueprint.join('\n * ')}`
        }
    }

    if (oldTour.includes[0]) {
        newTourFields.includes = {
            "ru-RU": ` * ${oldTour.includes.join('\n * ')}`
        }
    }

    if (oldTour.willLearn[0]) {
        newTourFields.willLearn = {
            "ru-RU": ` * ${oldTour.willLearn.join('\n * ')}`
        }
    }

    if (oldTour.details[0]) {
        newTourFields.details = {
            "ru-RU": oldTour.details.join('\n\n')
        }
    }

    const newTour = {
        "fields": newTourFields
    }

    return JSON.stringify(newTour)
}


client.getSpace(spaceId)
    .then((space) => {

        // fs.readdir('img/_tours', function(err, allImages){
        //     for (const Img of allImages) {
        //         space.createAssetWithId(
        //             Img,
        //             {
        //                 "fields": {
        //                     "title": {
        //                         "ru-RU": Img
        //                     },
        //                     "file": {
        //                         "ru-RU": {
        //                             "contentType": "image/jpeg",
        //                             "fileName": Img,
        //                             "upload": `https://github.com/none23/turoboz/raw/master/img/_tours/${Img}`
        //                         }
        //                     }
        //                 }
        //             }
        //         ).then((e) => e.processForAllLocales())
        //         .then((e) => console.log(e))
        //     }
        // })

        // const localToursList = Object.keys(localTours)
        // for (const localTourId of localToursList) {
        //     const localTour = localTours[localTourId]
        //     createTourEntry(space, localTourId, rebuild(localTourId, localTour))
        // }

        // fs.readdir('img/_posts', function(err, allImages){
        //     for (const Img of allImages) {
        //         space.createAssetWithId(
        //             Img,
        //             {
        //                 "fields": {
        //                     "title": {
        //                         "ru-RU": Img
        //                     },
        //                     "file": {
        //                         "ru-RU": {
        //                             "contentType": "image/jpeg",
        //                             "fileName": Img,
        //                             "upload": `https://github.com/none23/turoboz/raw/master/img/_posts/${Img}`
        //                         }
        //                     }
        //                 }
        //             }
        //         ).then((e) => e.processForAllLocales())
        //         .then((e) => console.log(e))
        //     }
        // })

         for (const localTestim of localTestims) {
             createTestimEntry(space, rebuildTestim(localTestim))
         }
    })

