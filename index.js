#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const jimp = require('jimp')

process.argv.shift()
process.argv.shift()

const sourceFile = process.argv.shift()
const destFolder = process.argv.shift()

if (!sourceFile || !destFolder) {

  console.error('Usage: appicon <source file> <.appiconset folder>')
  process.exit()
}

const contentInputFile = path.join(__dirname, 'Contents.json');
const contentOutputFile = path.join(destFolder, 'Contents.json')

console.log('Writing file ' + contentOutputFile)
fs.writeFileSync(contentOutputFile, fs.readFileSync(contentInputFile))

const images = require(contentInputFile).images

jimp.read(sourceFile, (err, image) => {

  if (err) {
    console.error('jimp: Error opening file ' + sourceFile + ': ', err)
    return
  }

  images.forEach((item) => {

    const baseSize = item.size.split('x')[0]
    const scale = item.scale.charAt(0)
    const size = baseSize * scale
    const filename = path.join(destFolder, item.filename)

    console.log(sourceFile + ' > ' + filename)
    image.clone().resize(size, size).write(filename)
  })
})
