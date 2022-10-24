import env from "../environment"
const cfsign = require("aws-cloudfront-sign")

const getCloudfrontSignParams = () => {
  return {
    keypairId: env.CLOUDFRONT_PUBLIC_KEY_ID,
    privateKeyPath: env.CLOUDFRONT_PRIVATE_KEY_PATH,
    expireTime: new Date().getTime() + 1000 * 60 * 60, // 1 hour
  }
}

export const getPresignedUrl = (file: string) => {
  const url = getUrl(file)
  return cfsign.getSignedUrl(url, getCloudfrontSignParams())
}

export const getUrl = (file: string) => {
  return `${env.CLOUDFRONT_CDN}/${file}`
}
