const packageJson = require("../package.json")
const { execSync } = require("child_process")
const fs = require("fs")

const TO_SYNC = "dist/"
const BUCKET_LOCATION = "s3://prod-budi-app-assets/assets"
const BASE_PROFILE = "budibase"
const S3_COMP_DIR = "@budibase/standard-components/dist"
const MANIFEST = "componentlibrary-latest.json"

function buildS3Path() {
  return `${BUCKET_LOCATION}/componentlibrary-${packageJson.version}/${S3_COMP_DIR}`
}

async function run() {
  let profile = process.env.AWS_PROFILE
  if (profile == null) {
    profile = BASE_PROFILE
  }
  // basic manifest file describing the latest
  fs.writeFileSync(MANIFEST, JSON.stringify({
    version: packageJson.version,
    dir: S3_COMP_DIR,
  }))
  execSync(`aws s3 sync ${TO_SYNC} ${buildS3Path()} --profile ${profile}`)
  execSync(`aws s3 cp ${MANIFEST} ${BUCKET_LOCATION}/${MANIFEST} --profile ${profile}`)
  fs.unlinkSync(MANIFEST)
}

run().then(() => {
  console.log(`Deployment complete, version ${packageJson.version}`)
}).catch((err) => {
  console.error(err)
})

