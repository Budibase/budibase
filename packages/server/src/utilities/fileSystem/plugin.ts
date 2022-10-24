const { budibaseTempDir } = require("../budibaseDir")
const fs = require("fs")
const { join } = require("path")
import { ObjectStoreBuckets } from "../../constants"
const { checkSlashesInUrl } = require("../")
const env = require("../../environment")
const fetch = require("node-fetch")

const DATASOURCE_PATH = join(budibaseTempDir(), "datasource")

export const getPluginMetadata = async (path: string) => {
  let metadata: any = {}
  try {
    const pkg = fs.readFileSync(join(path, "package.json"), "utf8")
    const schema = fs.readFileSync(join(path, "schema.json"), "utf8")

    metadata.schema = JSON.parse(schema)
    metadata.package = JSON.parse(pkg)

    if (
      !metadata.package.name ||
      !metadata.package.version ||
      !metadata.package.description
    ) {
      throw new Error(
        "package.json is missing one of 'name', 'version' or 'description'."
      )
    }
  } catch (err: any) {
    throw new Error(
      `Unable to process schema.json/package.json in plugin. ${err.message}`
    )
  }

  return { metadata, directory: path }
}

export const getDatasourcePlugin = async (
  name: string,
  url: string,
  hash: string
) => {
  if (!fs.existsSync(DATASOURCE_PATH)) {
    fs.mkdirSync(DATASOURCE_PATH)
  }
  const filename = join(DATASOURCE_PATH, name)
  const metadataName = `${filename}.bbmetadata`
  if (fs.existsSync(filename)) {
    const currentHash = fs.readFileSync(metadataName, "utf8")
    // if hash is the same return the file, otherwise remove it and re-download
    if (currentHash === hash) {
      return require(filename)
    } else {
      console.log(`Updating plugin: ${name}`)
      delete require.cache[require.resolve(filename)]
      fs.unlinkSync(filename)
    }
  }
  const fullUrl = checkSlashesInUrl(
    `${env.MINIO_URL}/${ObjectStoreBuckets.PLUGINS}/${url}`
  )
  const response = await fetch(fullUrl)
  if (response.status === 200) {
    const content = await response.text()
    fs.writeFileSync(filename, content)
    fs.writeFileSync(metadataName, hash)
    return require(filename)
  } else {
    throw new Error(
      `Unable to retrieve plugin - reason: ${await response.text()}`
    )
  }
}
