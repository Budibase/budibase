#!/bin/node
const { createApp } = require("./utils")

const APP_COUNT = 100

if (!process.argv[2]) {
  console.error("Please specify an API key as script argument.")
  process.exit(-1)
}

async function run() {
  for (let i = 0; i < APP_COUNT; i++) {
    const app = await createApp(process.argv[2])
    console.log(`App created: ${app._id}`)
  }
}

run()
  .then(() => {
    console.log(`Finished creating ${APP_COUNT} apps.`)
  })
  .catch(err => {
    console.error(err)
  })
