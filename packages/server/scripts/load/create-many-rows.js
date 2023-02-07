#!/bin/node
const { createApp, getTable, createRow } = require("./utils")

const ROW_COUNT = 1000

if (!process.argv[2]) {
  console.error("Please specify an API key as script argument.")
  process.exit(-1)
}

async function run() {
  const apiKey = process.argv[2]
  const app = await createApp(apiKey)
  console.log(`App created: ${app._id}`)
  const table = await getTable(apiKey, app._id)
  console.log(`Table found: ${table.name}`)
  const promises = []
  for (let i = 0; i < ROW_COUNT; i++) {
    promises.push(await createRow(apiKey, app._id, table))
  }
  await Promise.all(promises)
}

run()
  .then(() => {
    console.log(`Finished creating ${ROW_COUNT} rows.`)
  })
  .catch(err => {
    console.error(err)
  })
