import env from "../environment"
import * as cfsign from "aws-cloudfront-sign"

let PRIVATE_KEY: string | undefined

function getPrivateKey() {
  if (!env.CLOUDFRONT_PRIVATE_KEY_64) {
    throw new Error("CLOUDFRONT_PRIVATE_KEY_64 is not set")
  }

  if (PRIVATE_KEY) {
    return PRIVATE_KEY
  }

  PRIVATE_KEY = Buffer.from(env.CLOUDFRONT_PRIVATE_KEY_64, "base64").toString(
    "utf-8"
  )

  return PRIVATE_KEY
}

const getCloudfrontSignParams = () => {
  return {
    keypairId: env.CLOUDFRONT_PUBLIC_KEY_ID!,
    privateKeyString: getPrivateKey(),
    expireTime: new Date().getTime() + 1000 * 60 * 60, // 1 hour
  }
}

export const getPresignedUrl = (s3Key: string) => {
  const url = getUrl(s3Key)
  return cfsign.getSignedUrl(url, getCloudfrontSignParams())
}

export const getUrl = (s3Key: string) => {
  let prefix = "/"
  if (s3Key.startsWith("/")) {
    prefix = ""
  }
  return `${env.CLOUDFRONT_CDN}${prefix}${s3Key}`
}
