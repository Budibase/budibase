const fs = require("fs")
const AWS = require("aws-sdk")
const fetch = require("node-fetch")
const {
  budibaseAppsDir,
} = require("../../../utilities/budibaseDir")

async function fetchTemporaryCredentials() {
  const CREDENTIALS_URL = "https://dt4mpwwap8.execute-api.eu-west-1.amazonaws.com/prod/"

  const response = await fetch(CREDENTIALS_URL, {
    method: "POST",
    body: JSON.stringify({
      apiKey: "d498278c-4ab4-144b-c212-b8f9e6da5c2b"
    })
  })

  if (response.status !== 200) {
    throw new Error
  }

  const json = await response.json()

  return json
} 

exports.uploadAppAssets = async function ({ appId }) {
  const { credentials, accountId } = await fetchTemporaryCredentials()
  console.log({
    credentials,
    accountId
  });

  AWS.config.update({
    accessKeyId: credentials.AccessKeyId, 
    secretAccessKey: credentials.SecretAccessKey,
    sessionToken: credentials.SessionToken
  });

  const s3 = new AWS.S3({
    params: {
      Bucket: process.env.BUDIBASE_APP_ASSETS_BUCKET
    }
  })

  const appAssetsPath = `${budibaseAppsDir()}/${appId}/public`

  const appPages = fs.readdirSync(appAssetsPath)

  const uploads = []

  for (let page of appPages) {
    for (let filename of fs.readdirSync(`${appAssetsPath}/${page}`)) {
      const filePath =  `${appAssetsPath}/${page}/${filename}`
      const stat = await fs.lstatSync(filePath)
      
      // TODO: need to account for recursively traversing dirs
      if (stat.isFile()) {
        const fileBytes = fs.readFileSync(`${appAssetsPath}/${page}/${filename}`)

        console.log(`${accountId}/${appId}/${page}/${filename}`)

        const upload = s3.upload({
          Key: `assets/${accountId}/${appId}/${page}/${filename}`,
          Body: fileBytes
        }).promise()

        uploads.push(upload)
      }
    }
  }

  try {
    await Promise.all(uploads)
  } catch (err) {
    console.error("Error uploading budibase app assets to s3", err)
    throw err
  }
}