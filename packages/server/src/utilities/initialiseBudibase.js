const { existsSync, readFile, writeFile, ensureDir } = require("fs-extra")
const { join, resolve } = require("./centralPath")
const { stringTemplate } = require("./stringTemplating")
const uuid = require("uuid")

module.exports = async opts => {
  await ensureDir(opts.dir)
  await setCouchDbUrl(opts)

  // need an env file
  await createDevEnvFile(opts)
}

const setCouchDbUrl = async opts => {
  if (!opts.couchDbUrl) {
    const dataDir = join(opts.dir, ".data")
    await ensureDir(dataDir)
    opts.couchDbUrl =
      dataDir + (dataDir.endsWith("/") || dataDir.endsWith("\\") ? "" : "/")
  }
}

const createDevEnvFile = async opts => {
  const destConfigFile = join(opts.dir, "./.env")
  let createConfig = !existsSync(destConfigFile) || opts.quiet
  if (createConfig) {
    const template = await readFile(
      resolve(__dirname, "..", "..", ".env.template"),
      {
        encoding: "utf8",
      }
    )
    opts.cookieKey1 = opts.cookieKey1 || uuid.v4()
    const config = stringTemplate(template, opts)
    await writeFile(destConfigFile, config, { flag: "w+" })
  }
}
