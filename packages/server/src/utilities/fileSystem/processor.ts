import jimp from "jimp"

const FORMATS = {
  IMAGES: ["png", "jpg", "jpeg", "gif", "bmp", "tiff"],
}

function processImage(file: { path: string }) {
  // this will overwrite the temp file
  return jimp.read(file.path).then(img => {
    return img.resize(300, jimp.AUTO).write(file.path)
  })
}

export async function process(file: { extension: string; path: string }) {
  if (FORMATS.IMAGES.includes(file.extension.toLowerCase())) {
    await processImage(file)
  }
  return file
}
