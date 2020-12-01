const fs = require("fs")
const sanitize = require("sanitize-s3-objectkey")

const CONTENT_TYPE_MAP = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
}

exports.prepareUpload = async function({ s3Key, metadata, s3, file }) {
  const extension = [...file.name.split(".")].pop()
  const fileBytes = fs.readFileSync(file.path)

  const upload = await s3
    .upload({
      // windows file paths need to be converted to forward slashes for s3
      Key: sanitize(s3Key).replace(/\\/g, "/"),
      Body: fileBytes,
      ContentType: file.type || CONTENT_TYPE_MAP[extension.toLowerCase()],
      Metadata: metadata,
    })
    .promise()

  return {
    size: file.size,
    name: file.name,
    extension,
    url: upload.Location,
    key: upload.Key,
  }
}
