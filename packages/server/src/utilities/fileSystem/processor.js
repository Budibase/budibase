const jimp = require("jimp")

const FORMATS = {
  IMAGES: ["png", "jpg", "jpeg", "gif", "bmp", "tiff"],
}

function processImage(file) {
  // this will overwrite the temp file
  return jimp.read(file.path).then(img => {
    return img.resize(300, jimp.AUTO).write(file.path)
  })
}

async function process(file) {
  if (FORMATS.IMAGES.includes(file.extension.toLowerCase())) {
    await processImage(file)
  }
  return file
}

exports.process = process
