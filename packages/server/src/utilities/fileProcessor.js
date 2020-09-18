const fs = require("fs")
const sharp = require("sharp")
const fsPromises = fs.promises

const FORMATS = {
  IMAGES: ["png", "jpg", "jpeg", "gif", "svg", "tiff", "raw"],
}

async function processImage(file) {
  const imgMeta = await sharp(file.path)
    .resize(300)
    .toFile(file.outputPath)

  return {
    ...file,
    ...imgMeta,
  }
}

async function process(file) {
  if (FORMATS.IMAGES.includes(file.extension.toLowerCase())) {
    return await processImage(file)
  }

  // No processing required
  await fsPromises.copyFile(file.path, file.outputPath)
  return file
}

exports.process = process
