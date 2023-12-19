#!/bin/node
const { createApp, getTable, createRow, createTable } = require("./utils")

const ROW_COUNT = 10

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

  const subjectTable = await createTable(apiKey, app._id, {
    schema: {
      title: {
        name: "Name",
        type: "string",
      },
    },
    name: "Subjects",
  })
  for (let i = 0; i < 10; i++) {
    await createRow(apiKey, app._id, subjectTable)
  }

  const promises = []
  for (let i = 0; i < ROW_COUNT; i++) {
    promises.push(await createRow(apiKey, app._id, table))
    console.log(`Row ${i + 1} of ${ROW_COUNT} created`)
  }
  await Promise.all(promises)

  console.log(`App created: http://localhost:10000/builder/app/${app._id}`)
}

run()
  .then(() => {
    console.log(`Finished creating ${ROW_COUNT} rows.`)
  })
  .catch(err => {
    console.error(err)
  })
