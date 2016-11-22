const fetch = require('node-fetch')
const yaml = require('js-yaml')
const fs = require('fs')
const emojiStrip = require('emoji-strip')

const postsCount = 10
const groupId = 33948424
const vkPostsDirPath = '_vk_news'
const excludedPostsList = vkPostsDirPath + '/_excluded.json'

const requestURL = `https://api.vk.com/method/wall.get?owner_id=-${groupId}&count=${postsCount}&extended=1&filter=owner&https=1&v=5.53`

function attachmentIsPhoto (attachment) {
  return attachment.type.indexOf('photo') >= 0
}

const readExcluded = new Promise((resolve, reject) => {
  fs.readFile(excludedPostsList, function (err, data) {
    if (err) { reject(err) }
    resolve(data)
  })
})
  .then(JSON.parse)
  .then(data => data.excludedPosts)
  .catch(err => console.log(err))

const readSynced = new Promise((resolve, reject) => {
  fs.readdir(vkPostsDirPath, function (err, files) {
    if (err) { reject(err) }
    resolve(files)
  })
})
  .catch((err) => console.log(err))

const fetchOnline = fetch(requestURL)
  .then(res => res.json())
  .then(res => res.response.items)
  .catch(err => console.log(err))

fetchOnline.catch((err) => console.log(err))

function savePost (post) {
  const postDate = new Date(post.date * 1000)
  const postDateYear = postDate.getFullYear()

  const postDay = `0${postDate.getDate()}`
  const postDateDay = postDay.slice(postDay.length - 2)

  const postMonth = `0${postDate.getMonth() + 1}`
  const postDateMonth = postMonth.slice(postMonth.length - 2)

  const postImage = post.photos[0].photo.photo_1280 || post.photos[0].photo.photo_807 || post.photos[0].photo.photo_604
  const postBody = emojiStrip(post.text).split('\n').join('\n \n')
  const postTitle = emojiStrip(post.text).split(' ').splice(0, 8).join(' ')
  const postVKLink = `https://vk.com/club${groupId}?w=wall-${groupId}_${post.id}`
  const frontMatterObj = {
    dateposted: `${postDateDay}.${postDateMonth}.${postDateYear}`,
    permalink: `/vk_news/${post.id}/`,
    image: postImage,
    layout: 'blogpost',
    title: `${postTitle}...`,
    photos: post.textPhotos,
    vklink: `${postVKLink}`
  }
  const frontMatterYaml = yaml.dump(frontMatterObj)
  const fileName = `./${vkPostsDirPath}/${post.id}.md`
  const postMarkdown = `---
${frontMatterYaml}
---
${postBody}
`
  fs.writeFile(fileName, postMarkdown, 'utf8', err => {
    if (err) { throw err }
    console.log(`written ${fileName}`)
  })
}

const processData = Promise.all([
  fetchOnline,
  readSynced,
  readExcluded
])
  .then(value => {
    const online = value[0]
    const synced = value[1]
    const exclud = value[2]
    for (const post of online) {
      const postPromise = new Promise((resolve, reject) => {
        // Not explicitly excluded
        if (exclud.includes(`${post.id}.md`)) {
          reject(`skipping ${post.id}: explicitly excluded`)
        }
        // Not already saved
        if (synced.includes(`${post.id}.md`)) {
          reject(`skipping ${post.id}: already synched`)
        }
        // Posted by the community
        if (post.from_id !== -groupId) {
          reject(`skipping ${post.id}: bad 'from_id'`)
        }
        // Not a repost
        if (post.copy_history) {
          reject(`skipping ${post.id}: has copy_history`)
        }

        // Text has at least 200 chars long
        if (post.text.length < 200) {
          reject(`skipping ${post.id}: text too short`)
        }

        // Has at least one photo attachment
        if (!post.attachments) {
          reject(`skipping ${post.id}: no attachments`)
        }

        post.photos = post.attachments.filter(attachmentIsPhoto)
        if (post.photos.length >= 1) {
          resolve(post)
        } else {
          reject(`skipping ${post.id}: no photo attachments`)
        }
      })
        .then(post => {
          post.textPhotos = []
          if (post.photos.length >= 2) {
            for (const attachmentPhoto of post.photos.slice(1)) {
              const photoImage = attachmentPhoto.photo.photo_1280 || attachmentPhoto.photo.photo_807 || attachmentPhoto.photo.photo_604 || undefined
              if (photoImage) {
                post.textPhotos.push(photoImage)
              }
            }
          }
          savePost(post)
        }, reason => console.log(reason))
      postPromise.catch(reason => {
        console.log(reason)
      })
    }
  }
    , reason => console.log(reason))
processData.catch(err => console.log(err))
