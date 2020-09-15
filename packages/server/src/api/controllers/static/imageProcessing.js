const fs = require("fs");
const sharp = require("sharp");

const SIZES = []

const IMG_FORMATS = ["png", "jpeg", "jpg", "svg"]

function processImage({ path, outputPath }) {
  return sharp(path)
  .resize(200)
  .toFile(outputPath)
}

exports.processImage = processImage