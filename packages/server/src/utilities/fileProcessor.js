const fs = require("fs")
const jimp = require("jimp")
const fsPromises = fs.promises

const FORMATS = {
  IMAGES: ["png", "jpg", "jpeg", "gif", "bmp", "tiff"],
}

function processImage(file) {
  return jimp.read(file.path).then(img => {
    return img.resize(300, jimp.AUTO).write(file.outputPath)
  })
}

async function process(file) {
  if (FORMATS.IMAGES.includes(file.extension.toLowerCase())) {
    await processImage(file)
    return file
  }

  // No processing required
  await fsPromises.copyFile(file.path, file.outputPath)
  return file
}

exports.process = process
