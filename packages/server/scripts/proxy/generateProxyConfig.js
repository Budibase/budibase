#!/usr/bin/env node
const path = require("path")
const fs = require("fs")
const { processStringSync } = require("@budibase/string-templates")

const Configs = {
  prod: {
    apps: "app-service.budibase.svc.cluster.local",
    worker: "worker-service.budibase.svc.cluster.local",
    minio: "minio-service.budibase.svc.cluster.local",
    couchdb: "budibase-prod-svc-couchdb",
  },
  preprod: {
    apps: "app-service.budibase.svc.cluster.local",
    worker: "worker-service.budibase.svc.cluster.local",
    minio: "minio-service.budibase.svc.cluster.local",
    couchdb: "budibase-preprod-svc-couchdb",
  },
  compose: {
    compose: true,
    apps: "app-service",
    worker: "worker-service",
    minio: "minio-service",
    couchdb: "couchdb-service",
  },
}

const Commands = {
  Prod: "prod",
  Preprod: "preprod",
  Compose: "compose",
}

async function init(managementCommand) {
  const config = Configs[managementCommand]
  const hostingPath = path.join(process.cwd(), "..", "..", "hosting")
  const nginxHbsPath = path.join(hostingPath, "nginx.prod.conf.hbs")
  const nginxOutputPath = path.join(
    hostingPath,
    "proxy",
    ".generated-nginx.prod.conf"
  )
  const contents = fs.readFileSync(nginxHbsPath, "utf8")
  fs.writeFileSync(nginxOutputPath, processStringSync(contents, config))
}

const managementCommand = process.argv.slice(2)[0]

if (
  !managementCommand ||
  !Object.values(Commands).some(command => managementCommand === command)
) {
  throw new Error(
    "You must supply either a 'compose', 'preprod' or 'prod' commmand to generate an NGINX config."
  )
}

init(managementCommand)
  .then(() => {
    console.log("Done! 🎉")
  })
  .catch(err => {
    console.error(
      "Something went wrong while creating the nginx configuration",
      err.message
    )
  })
