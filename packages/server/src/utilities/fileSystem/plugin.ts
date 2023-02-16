import { Plugin } from "@budibase/types"
import { budibaseTempDir } from "../budibaseDir"
import fs from "fs"
import { join } from "path"
import { objectStore } from "@budibase/backend-core"

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

export const getDatasourcePlugin = async (plugin: Plugin) => {
  const hash = plugin.schema?.hash
  if (!fs.existsSync(DATASOURCE_PATH)) {
    fs.mkdirSync(DATASOURCE_PATH)
  }
  const filename = join(DATASOURCE_PATH, plugin.name)
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

  fs.writeFileSync(filename, pluginJs)
  fs.writeFileSync(metadataName, hash)

  return require(filename)
}
