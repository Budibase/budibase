const { exists, readFile, writeFile, ensureDir } = require("fs-extra")
const { join, resolve } = require("path")
const Sqrl = require("squirrelly")
const uuid = require("uuid")

module.exports = async opts => {
  await ensureDir(opts.dir)
  await setCouchDbUrl(opts)

  // need an env file to create the client database
  await createDevEnvFile(opts)
  await createClientDatabase(opts)

  // need to recreate the env file, as we only now have a client id
  // quiet flag will force overwrite of config
  opts.quiet = true
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
  let createConfig = !(await exists(destConfigFile)) || opts.quiet
  if (createConfig) {
    const template = await readFile(
      resolve(__dirname, "..", "..", ".env.template"),
      {
        encoding: "utf8",
      }
    )
    opts.cookieKey1 = opts.cookieKey1 || uuid.v4()
    const config = Sqrl.Render(template, opts)
    await writeFile(destConfigFile, config, { flag: "w+" })
  }
}

const createClientDatabase = async opts => {
  // cannot be a top level require as it
  // will cause environment module to be loaded prematurely
  const clientDb = require("../db/clientDb")

  if (!opts.clientId || opts.clientId === "new") {
    // cannot be a top level require as it
    // will cause environment module to be loaded prematurely
    const CouchDB = require("../db/client")
    const existing = await CouchDB.allDbs()

    let i = 0
    let isExisting = true
    while (isExisting) {
      i += 1
      opts.clientId = i.toString()
      isExisting = existing.includes(clientDb.name(opts.clientId))
    }
  }

  await clientDb.create(opts.clientId)
}
