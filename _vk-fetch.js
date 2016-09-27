const fetch = require('node-fetch')
const yaml = require('js-yaml')
const fs = require('fs')

const postsCount = 20
const groupId = 33948424
const vkPostsDirPath = '_vk_news'

const requestURL = `https://api.vk.com/method/wall.get?\
owner_id=-${groupId}&count=${postsCount}&extended=1&filter=owner&https=1&v=5.53`

function attachmentIsPhoto(attachment) {
    return attachment.type.indexOf('photo') >= 0
}
const readSynced = new Promise((resolve, reject) => {

    fs.readdir(vkPostsDirPath, function(err, files) {
        if (err) { reject() }
        resolve(files)
    })
})
readSynced.catch((err) => { throw err })

const fetchOnline = fetch(requestURL)
    .then((res) => res.json())
        .then((res) => res.response.items)
            .catch((err) => { throw err })

fetchOnline.catch((err) => { throw err })

function savePost(post) {
    const postDate = new Date(post.date * 1000)
    const postDateYear = postDate.getFullYear()

    const postDay = `0${postDate.getDate()}`
    const postDateDay = postDay.slice(postDay.length - 2)

    const postMonth = `0${postDate.getMonth() + 1}`
    const postDateMonth = postMonth.slice(postMonth.length - 2)

    
    const postImage = post.photos[0].photo.photo_1280 || post.photos[0].photo.photo_807 || post.photos[0].photo.photo_604
    const postBody = post.text.split("\n").join("\n \n \n")
    const postTitle = post.text.split(" ").splice(0, 8).join(" ")
    const frontMatterObj = {
        'dateposted': `${postDateDay}.${postDateMonth}.${postDateYear}`,
        'image':  postImage,
        'layout': 'blogpost',
        'title': `${postTitle}...`
    }
    const frontMatterYaml = yaml.dump(frontMatterObj)
    const fileName = `./${vkPostsDirPath}/${post.id}.md`
    const postMarkdown = `---\n${frontMatterYaml}\n---\n${postBody}\n`
    fs.writeFile(fileName, postMarkdown, 'utf8', (err) => {
        if (err) { throw err }
        console.log(`written ${fileName}`)
    })
}
function saveJSON(post) {

    const fileName = `./${vkPostsDirPath}/_${post.id}.json`

    const fileContent = {
        attachments: post.attachments,
        date: post.date,
        id: post.id,
        text: post.text
    }

    const fileJSON = JSON.stringify(fileContent)
    fs.writeFile(fileName, fileJSON, 'utf8', (err) => {
        if (err) { throw err }
        console.log(`written ${fileName}`)
    })
}

const processData = Promise.all([
    fetchOnline,
    readSynced
])
    .then((res) => {
        const online = res[0]
        const synced = res[1]
        for (const post of online) {
            const postPromise = new Promise((resolve, reject) => {
                if (!synced.includes(`${post.id}.md`)) {

                    // Posted by the community
                    if (post.from_id !== -groupId) {
                        console.log(`skipping ${post.id}: bad 'from_id'`)
                        reject()
                    }

                    // Not signed
                    if (post.signer_id) {
                        if (post.signer_id !== -groupId) {
                            console.log(`skipping ${post.id}: is signed`)
                            reject()
                        }
                    }

                    // Not a repost
                    if (post.copy_history) {
                        console.log(`skipping ${post.id}: has copy_history`)
                        reject()
                    }

                    // Text has at least 200 chars long
                    if (post.text.length < 200) {
                        console.log(`skipping ${post.id}: text too short`)
                        reject()
                    }

                    // Has at least one photo attachment
                    if (!post.attachments) {
                        console.log(`skipping ${post.id}: no attachments`)
                        reject()
                    } 
                    post.photos = post.attachments.filter(attachmentIsPhoto)
                    if (post.photos) {
                        resolve(post)
                    } else {
                        console.log(`skipping ${post.id}: no photo attachments`)
                        reject()
                    }
                }
            })
            .then((post) => {
                saveJSON(post)
                savePost(post)
            })
            postPromise.catch(() => console.log(`skipped ${post.id}`))
        }
    })

processData.catch((err) => { throw err })
