#!/bin/node
const { createApp, getTable, createRow, createTable } = require("./utils")

const Chance = require("chance")
const generator = new Chance()

const STUDENT_COUNT = 100
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
  console.log(`App created: http://localhost:10000/builder/app/${app._id}`)

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

  let studentNumber = studentsTable.schema["Auto ID"].lastID
  for (let i = 0; i < STUDENT_COUNT; i++) {
    await createRow(apiKey, app._id, studentsTable, {
      "Student Number": (++studentNumber).toString(),
      "First Name": generator.first(),
      "Last Name": generator.last(),
      Gender: generator.pickone(["M", "F"]),
      Grade: generator.pickone(["8", "9", "10", "11"]),
      "Tardiness (Days)": generator.integer({ min: 1, max: 100 }),
      "Home Number": generator.phone(),
      "Attendance_(%)": generator.integer({ min: 0, max: 100 }),
    })
    console.log(`Row ${i + 1} of ${STUDENT_COUNT} created`)
  }
}

run().catch(err => {
  console.error(err)
})
