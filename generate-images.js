const fs = require('fs')
const gm = require('gm')

const cSizes = { tours: [300, 400, 600, 800]
               , posts: [200, 350, 430, 600, 800]
               }

/** process a collection */
const processCollection = collection => {
  /** get all base images */
  fs.readdir( `img/_${collection}`
            , (err, baseImgs) => {

            /** get processed images */
                fs.readdir( `img/${collection}${cSizes[collection][0]}`
                          , (err, procImgs) => {
                              if (err) console.log(err)

                              /** iterate over images in collection */
                                baseImgs.forEach(file => checkNeedsResize(file, procImgs, collection))
                })
  })
}

/** check if resized images exist */
const checkNeedsResize = (file, procImgs, collection) => {
  if (procImgs.includes(file)) return
  processImage(file, collection)
}

/** generate resized images */
const processImage = (file, collection) => {
  cSizes[collection].forEach(wid => doResize(file, wid, collection))
}

/** resize image */
const doResize = (file, wid, collection) => {
  let hei = wid * 3 / 4
  let outputFile = `img/${collection}${wid}/${file}`

  gm(`img/_${collection}/${file}`)
    .filter(`triangle`)
    .resize(wid, hei, `^`)
    .extent(wid, hei)
    .gravity(`Center`)
    .unsharp(0.25, 0.08, 8.3, 0.045)
    .dither(false)
    .quality(82)
    .write(outputFile, err => {
      if (err) console.log(err)
      console.log(`+`)
    })
}

Object.keys(cSizes).forEach(collection => processCollection(collection))
