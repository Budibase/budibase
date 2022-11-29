import env from "../environment"
const cfsign = require("aws-cloudfront-sign")

let PRIVATE_KEY_STRING: string
if (env.CLOUDFRONT_PRIVATE_KEY_64) {
  PRIVATE_KEY_STRING = Buffer.from(
    env.CLOUDFRONT_PRIVATE_KEY_64,
    "base64"
  ).toString("utf-8")
}

const getCloudfrontSignParams = () => {
  return {
    keypairId: env.CLOUDFRONT_PUBLIC_KEY_ID,
    privateKeyString: PRIVATE_KEY_STRING,
    expireTime: new Date().getTime() + 1000 * 60 * 60, // 1 hour
  }
}

export const getPresignedUrl = (file: string) => {
  const url = getUrl(file)
  return cfsign.getSignedUrl(url, getCloudfrontSignParams())
}

export const getUrl = (file: string) => {
  let prefix = "/"
  if (file.startsWith("/")) {
    prefix = ""
  }
  return `${env.CLOUDFRONT_CDN}${prefix}${file}`
}
