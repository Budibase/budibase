const fs = require("fs");
const sharp = require("sharp");
const fsPromises = fs.promises;

const FORMATS = {
  IMAGES: ["png", "jpg", "jpeg", "gif", "svg", "tiff", "raw"],
}

function processImage({ path, outputPath }) {
    return sharp(path)
    .resize(300)
    .toFile(outputPath)
}

function process(file) {
  if (FORMATS.IMAGES.includes(file.extension.toLowerCase())) {
    return processImage(file);
  }

  // No processing required
  return fsPromises.copyFile(file.path, file.outputPath) 
}

exports.process = process