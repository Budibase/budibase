import { Jimp } from "jimp"

const FORMATS = {
  IMAGES: ["png", "jpg", "jpeg", "gif", "bmp", "tiff"],
}

function processImage(file: { path: string }) {
  // this will overwrite the temp file
  return Jimp.read(file.path).then(img => {
    return img.resize({ w: 256 }).write(file.path as `${string}.${string}`)
  })
}

export async function process(file: { extension: string; path: string }) {
  if (FORMATS.IMAGES.includes(file.extension.toLowerCase())) {
    await processImage(file)
  }
  return file
}
