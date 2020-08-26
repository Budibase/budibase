const { resolve } = require("path")
const { cwd } = require("process")
const stream = require("stream")
const fetch = require("node-fetch")
const tar = require("tar-fs")
const zlib = require("zlib")
const { promisify } = require("util")
const packageJson = require("../../package.json")

const streamPipeline = promisify(stream.pipeline)

exports.appPackageFolder = (config, appname) =>
  resolve(cwd(), config.latestPackagesFolder, appname)

exports.downloadExtractComponentLibraries = async appFolder => {
  const LIBRARIES = ["standard-components"]

  // Need to download tarballs directly from NPM as our users may not have node on their machine
  for (let lib of LIBRARIES) {
    // download tarball
    const registryUrl = `https://registry.npmjs.org/@budibase/${lib}/-/${lib}-${packageJson.version}.tgz`
    const response = await fetch(registryUrl)
    if (!response.ok)
      throw new Error(`unexpected response ${response.statusText}`)

    await streamPipeline(
      response.body,
      zlib.Unzip(),
      tar.extract(`${appFolder}/node_modules/@budibase/${lib}`)
    )
  }
}
