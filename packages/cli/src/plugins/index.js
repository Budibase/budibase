const Command = require("../structures/Command")
const { CommandWords, AnalyticsEvents, InitTypes } = require("../constants")
const { getSkeleton, fleshOutSkeleton } = require("./skeleton")
const questions = require("../questions")
const fs = require("fs")
const { PLUGIN_TYPE_ARR } = require("@budibase/types")
const { plugins } = require("@budibase/backend-core")
const { runPkgCommand } = require("../exec")
const { join } = require("path")
const { success, error, info, moveDirectory } = require("../utils")
const { captureEvent } = require("../events")
const fp = require("find-free-port")
const { GENERATED_USER_EMAIL } = require("../constants")
const { init: hostingInit } = require("../hosting/init")
const { start: hostingStart } = require("../hosting/start")

function checkInPlugin() {
  if (!fs.existsSync("package.json")) {
    throw new Error(
      "Please run in a plugin directory - must contain package.json"
    )
  }
  if (!fs.existsSync("schema.json")) {
    throw new Error(
      "Please run in a plugin directory - must contain schema.json"
    )
  }
}

async function askAboutTopLevel(name) {
  const files = fs.readdirSync(process.cwd())
  // we are in an empty git repo, don't ask
  if (files.find(file => file === ".git")) {
    return false
  } else {
    console.log(
      info(`By default the plugin will be created in the directory "${name}"`)
    )
    console.log(
      info(
        "if you are already in an empty directory, such as a new Git repo, you can disable this functionality."
      )
    )
    return questions.confirmation("Create top level directory?")
  }
}

async function init(opts) {
  const type = opts["init"] || opts
  if (!type || !PLUGIN_TYPE_ARR.includes(type)) {
    console.log(
      error(
        "Please provide a type to init, either 'component' or 'datasource'."
      )
    )
    return
  }
  console.log(info("Lets get some details about your new plugin:"))
  const name = await questions.string("Name", `budibase-${type}`)
  if (fs.existsSync(name)) {
    console.log(
      error("Directory by plugin name already exists, pick a new name.")
    )
    return
  }
  const description = await questions.string(
    "Description",
    `An amazing Budibase ${type}!`
  )
  const version = await questions.string("Version", "1.0.0")
  const topLevel = await askAboutTopLevel(name)
  // get the skeleton
  console.log(info("Retrieving project..."))
  await getSkeleton(type, name)
  await fleshOutSkeleton(type, name, description, version)
  console.log(info("Installing dependencies..."))
  await runPkgCommand("install", join(process.cwd(), name))
  // if no parent directory desired move to cwd
  if (!topLevel) {
    moveDirectory(name, process.cwd())
    console.log(info(`Plugin created in current directory.`))
  } else {
    console.log(info(`Plugin created in directory "${name}"`))
  }
  captureEvent(AnalyticsEvents.PluginInit, {
    type,
    name,
    description,
    version,
  })
}

async function verify() {
  // will throw errors if not acceptable
  checkInPlugin()
  console.log(info("Verifying plugin..."))
  const schema = fs.readFileSync("schema.json", "utf8")
  const pkg = fs.readFileSync("package.json", "utf8")
  let name, version
  try {
    const schemaJson = JSON.parse(schema)
    const pkgJson = JSON.parse(pkg)
    if (!pkgJson.name || !pkgJson.version || !pkgJson.description) {
      throw new Error(
        "package.json is missing one of 'name', 'version' or 'description'."
      )
    }
    name = pkgJson.name
    version = pkgJson.version
    plugins.validate(schemaJson)
    return { name, version }
  } catch (err) {
    if (err && err.message && err.message.includes("not valid JSON")) {
      console.log(error(`schema.json is not valid JSON: ${err.message}`))
    } else {
      console.log(error(`Invalid schema/package.json: ${err.message}`))
    }
  }
}

async function build() {
  const verified = await verify()
  if (!verified.name) {
    return
  }
  console.log(success("Verified!"))
  console.log(info("Building plugin..."))
  await runPkgCommand("build")
  const output = join("dist", `${verified.name}-${verified.version}.tar.gz`)
  console.log(success(`Build complete - output in: ${output}`))
}

async function watch() {
  const verified = await verify()
  if (!verified.name) {
    return
  }
  const output = join("dist", `${verified.name}-${verified.version}.tar.gz`)
  console.log(info(`Watching - build in: ${output}`))
  try {
    await runPkgCommand("watch")
  } catch (err) {
    // always errors when user escapes
    console.log(success("Watch exited."))
  }
}

async function dev() {
  const pluginDir = await questions.string("Directory to watch", "./")
  const [port] = await fp(10000)
  const password = "admin"
  await hostingInit({
    init: InitTypes.QUICK,
    single: true,
    watchPluginDir: pluginDir,
    genUser: password,
    port,
    silent: true,
  })
  await hostingStart()
  console.log(success(`Configuration has been written to docker-compose.yaml`))
  console.log(
    success("Development environment started successfully - connect at: ") +
      info(`http://localhost:${port}`)
  )
  console.log(success("Use the following credentials to login:"))
  console.log(success("Email: ") + info(GENERATED_USER_EMAIL))
  console.log(success("Password: ") + info(password))
}

const command = new Command(`${CommandWords.PLUGIN}`)
  .addHelp(
    "Custom plugins for Budibase, init, build and verify your components and datasources with this tool."
  )
  .addSubOption(
    "--init [type]",
    "Init a new plugin project, with a type of either component or datasource.",
    init
  )
  .addSubOption(
    "--build",
    "Build your plugin, this will verify and produce a final tarball for your project.",
    build
  )
  .addSubOption(
    "--watch",
    "Automatically build any changes to your plugin.",
    watch
  )
  .addSubOption(
    "--dev",
    "Run a development environment which automatically watches the current directory.",
    dev
  )

exports.command = command
