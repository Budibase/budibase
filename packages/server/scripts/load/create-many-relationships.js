#!/bin/node
const { createApp, getTable, createRow, createTable } = require("./utils")

const Chance = require("chance")
const generator = new Chance()

const STUDENT_COUNT = 10
const SUBJECT_COUNT = 10

if (!process.argv[2]) {
  console.error("Please specify an API key as script argument.")
  process.exit(-1)
}

async function sleep(ms) {
  return new Promise(r => setTimeout(() => r(), ms))
}

async function run() {
  const apiKey = process.argv[2]
  const app = await createApp(apiKey)
  console.log(`App created: ${app._id}`)
  const studentsTable = await getTable(apiKey, app._id)
  if (studentsTable.name !== "Students") {
    throw 'Fetched table should be "Students"'
  }
  console.log(`Table found: ${studentsTable.name}`)

  const subjectTable = await createTable(apiKey, app._id, {
    schema: {
      Name: {
        name: "Name",
        type: "string",
      },
    },
    name: "Subjects",
  })

  for (let i = 0; i < SUBJECT_COUNT; i++) {
    await createRow(apiKey, app._id, subjectTable, {
      Name: generator.profession(),
    })
    console.log(`Subject ${i + 1} of ${SUBJECT_COUNT} created`)
    await sleep(50)
  }

  for (let i = 0; i < STUDENT_COUNT; i++) {
    await createRow(apiKey, app._id, studentsTable)
    console.log(`Row ${i + 1} of ${STUDENT_COUNT} created`)
  }

  console.log(`App created: http://localhost:10000/builder/app/${app._id}`)
}

run()
  .then(() => {
    console.log(`Finished creating ${ROW_COUNT} rows.`)
  })
  .catch(err => {
    console.error(err)
  })
