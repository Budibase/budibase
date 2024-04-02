#!/bin/node
const { searchApps, deleteApp } = require("./utils")

if (!process.argv[2]) {
  console.error("Please specify an API key as script argument.")
  process.exit(-1)
}

async function run() {
  const apiKey = process.argv[2]
  const apps = await searchApps(apiKey)
  console.log(`Deleting ${apps.length} apps`)

  let deletedApps = 0
  await Promise.all(
    apps.map(async app => {
      await deleteApp(apiKey, app._id)
      console.log(`App ${++deletedApps} of ${apps.length} deleted`)
    })
  )
}

run()
  .then(() => {
    console.log("Done!")
  })
  .catch(err => {
    console.error(err)
  })
