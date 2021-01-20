const env = require("../../environment")
const got = require("got")
const AWS = require("aws-sdk")

const APP_BUCKET = "app-assets"
// this doesn't matter in self host
const REGION = "eu-west-1"
const PUBLIC_READ_POLICY = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        AWS: ["*"],
      },
      Action: "s3:GetObject",
      Resource: [`arn:aws:s3:::${APP_BUCKET}/*`],
    },
  ],
}

async function getCouchSession() {
  // fetch session token for the api user
  const session = await got.post(`${env.COUCH_DB_URL}/_session`, {
    responseType: "json",
    credentials: "include",
    json: {
      username: env.COUCH_DB_USERNAME,
      password: env.COUCH_DB_PASSWORD,
    },
  })

  const cookie = session.headers["set-cookie"][0]
  // Get the session cookie value only
  return cookie.split(";")[0]
}

async function getMinioSession() {
  AWS.config.update({
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
  })

  // make sure the bucket exists
  const objClient = new AWS.S3({
    endpoint: env.RAW_MINIO_URL,
    region: REGION,
    s3ForcePathStyle: true, // needed with minio?
    params: {
      Bucket: APP_BUCKET,
    },
  })
  // make sure the bucket exists
  try {
    await objClient
      .headBucket({
        Bucket: APP_BUCKET,
      })
      .promise()
  } catch (err) {
    // bucket doesn't exist create it
    if (err.statusCode === 404) {
      await objClient
        .createBucket({
          Bucket: APP_BUCKET,
        })
        .promise()
    } else {
      throw err
    }
  }
  // always make sure policy is correct
  await objClient
    .putBucketPolicy({
      Bucket: APP_BUCKET,
      Policy: JSON.stringify(PUBLIC_READ_POLICY),
    })
    .promise()
  // Ideally want to send back some pre-signed URLs for files that are to be uploaded
  return {
    accessKeyId: env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,
  }
}

exports.deploy = async ctx => {
  ctx.body = {
    couchDbSession: await getCouchSession(),
    bucket: APP_BUCKET,
    objectStoreSession: await getMinioSession(),
  }
}
