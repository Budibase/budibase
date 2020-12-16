const env = require("../../environment")
const got = require("got")
const AWS = require("aws-sdk")

const APP_BUCKET = "app-assets"
// this doesn't matter in self host
const REGION = "eu-west-1"

async function getCouchSession() {
  // fetch session token for the api user
  const session = await got.post(`${env.RAW_COUCH_DB_URL}/_session`, {
    responseType: "json",
    json: {
      username: env.COUCH_DB_USERNAME,
      password: env.COUCH_DB_PASSWORD,
    }
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
    await objClient.headBucket({ Bucket: APP_BUCKET }).promise()
  } catch (err) {
    // bucket doesn't exist create it
    if (err.statusCode === 404) {
      await objClient.createBucket({ Bucket: APP_BUCKET }).promise()
    } else {
      throw err
    }
  }
  // TODO: this doesn't seem to work get an error
  // TODO: Generating temporary credentials not allowed for this request.
  // TODO: this should work based on minio documentation
  // const sts = new AWS.STS({
  //   endpoint: env.RAW_MINIO_URL,
  //   region: REGION,
  //   s3ForcePathStyle: true,
  // })
  // // NOTE: In the following commands RoleArn and RoleSessionName are not meaningful for MinIO
  // const params = {
  //   DurationSeconds: 3600,
  //   ExternalId: "123ABC",
  //   Policy: '{"Version":"2012-10-17","Statement":[{"Sid":"Stmt1","Effect":"Allow","Action":"s3:*","Resource":"arn:aws:s3:::*"}]}',
  //   RoleArn: 'arn:xxx:xxx:xxx:xxxx',
  //   RoleSessionName: 'anything',
  // };
  // const assumedRole = await sts.assumeRole(params).promise();
  // if (!assumedRole) {
  //   throw "Unable to get access to object store."
  // }
  // return assumedRole.Credentials
  // TODO: need to do something better than this
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
    couchDbUrl: env.RAW_COUCH_DB_URL,
    objectStoreUrl: env.RAW_MINIO_URL,
  }
}
