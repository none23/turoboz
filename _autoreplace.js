const fs = require('fs')
const path = require('path')

const prependFilenames = (files, dir) => {
  return files.map(file => path.join(dir, file))
}

const enumFiles = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err)
      resolve(prependFilenames(files, dir))
    })
  })
}

const readFile = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if(err) reject(err)
      resolve([filename, data])
    })
  })
}

const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      if(err) reject(err)
      resolve()
    })
  })
}

const changeContent = content => {
  return new Promise(resolve => {
    resolve(content)
  })
    .then(pair => [pair[0], pair[1].replace(' turobozperm@mail.ru', ' [info@turoboz.com](mailto:info@turoboz.com)')])
    .then(pair => [pair[0], pair[1].replace(' 89082757092', ' [8 908 275 70 92](tel:89082757092)')])
    .then(pair => [pair[0], pair[1].replace(' +79082757092', ' [8 908 275 70 92](tel:89082757092)')])
    .then(pair => [pair[0], pair[1].replace(' 8(342)2680362', ' [8 (342) 268 03 62](tel:83422680362)')])
}

const processCollection = path => {
  enumFiles(path)
    .then(files => Promise.all(files.map(file => readFile(file))))
    .then(filesContent => Promise.all(filesContent.map(fileContent => changeContent(fileContent))))
    .then(data => data.map(fileContent => writeFile(fileContent[0], fileContent[1])))
    .then(() => console.log(`${path}\t\t\t\t✓`))
}

const collections = ['_news', '_tours', '_vk_news']

collections.forEach(path => processCollection(path))
