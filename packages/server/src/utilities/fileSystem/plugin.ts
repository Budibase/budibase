import { Plugin, PluginUpload } from "@budibase/types"
import { budibaseTempDir } from "../budibaseDir"
import fs from "fs"
import { join } from "path"
import { objectStore } from "@budibase/backend-core"
import stream from "stream"

const DATASOURCE_PATH = join(budibaseTempDir(), "datasource")
const AUTOMATION_PATH = join(budibaseTempDir(), "automation")

export const getPluginMetadata = async (
  path: string
): Promise<PluginUpload> => {
  let pkg: any
  let schema: any
  try {
    pkg = JSON.parse(fs.readFileSync(join(path, "package.json"), "utf8"))
    schema = JSON.parse(fs.readFileSync(join(path, "schema.json"), "utf8"))
    if (!pkg.name) {
      throw new Error("package.json is missing 'name'.")
    }
    if (!pkg.version) {
      throw new Error("package.json is missing 'version'.")
    }
    if (!pkg.description) {
      throw new Error("package.json is missing 'description'.")
    }
  } catch (err: any) {
    throw new Error(
      `Unable to process schema.json/package.json in plugin. ${err.message}`,
      { cause: err }
    )
  }

  return { metadata: { package: pkg, schema }, directory: path }
}

async function getPluginImpl(path: string, plugin: Plugin) {
  const hash = plugin.schema?.hash
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  const filename = join(path, plugin.name)
  const metadataName = `${filename}.bbmetadata`
  if (fs.existsSync(filename)) {
    const currentHash = fs.readFileSync(metadataName, "utf8")
    // if hash is the same return the file, otherwise remove it and re-download
    if (currentHash === hash) {
      return require(filename)
    } else {
      console.log(`Updating plugin: ${plugin.name}`)
      delete require.cache[require.resolve(filename)]
      fs.unlinkSync(filename)
    }
  }
  const pluginKey = objectStore.getPluginJSKey(plugin)
  const pluginJs = await objectStore.retrieve(
    objectStore.ObjectStoreBuckets.PLUGINS,
    pluginKey
  )

  if (pluginJs instanceof stream.Readable) {
    pluginJs.pipe(fs.createWriteStream(filename))
  } else {
    fs.writeFileSync(filename, pluginJs)
  }
  fs.writeFileSync(metadataName, hash)

  return require(filename)
}

export const getDatasourcePlugin = async (plugin: Plugin) => {
  return getPluginImpl(DATASOURCE_PATH, plugin)
}

export const getAutomationPlugin = async (plugin: Plugin) => {
  return getPluginImpl(AUTOMATION_PATH, plugin)
}
