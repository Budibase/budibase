#!/bin/node
const { createApp, getTable, createRow, createTable } = require("./utils")

const Chance = require("chance")
const generator = new Chance()

const STUDENT_COUNT = 500
const SUBJECT_COUNT = 10

const batchSize = 100

if (!process.argv[2]) {
  console.error("Please specify an API key as script argument.")
  process.exit(-1)
}

const start = Date.now()

async function batchCreate(apiKey, appId, count, table, generator) {
  let i = 0

  async function createSingleRow() {
    const row = await createRow(apiKey, appId, table, generator())
    console.log(
      `${table.name} - ${++i} of ${count} created (${
        (Date.now() - start) / 1000
      }s)`
    )
    return row
  }

  const rows = []
  for (let j = 0; j < count; j += batchSize) {
    const batchPromises = Array.from(
      { length: Math.min(batchSize, count - j) },
      createSingleRow
    )
    const batchRows = await Promise.all(batchPromises)
    rows.push(...batchRows)
  }
  return rows
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

  let studentNumber = studentsTable.schema["Auto ID"].lastID
  const students = await batchCreate(
    apiKey,
    app._id,
    STUDENT_COUNT,
    studentsTable,
    () => ({
      "Student Number": (++studentNumber).toString(),
      "First Name": generator.first(),
      "Last Name": generator.last(),
      Gender: generator.pickone(["M", "F"]),
      Grade: generator.pickone(["8", "9", "10", "11"]),
      "Tardiness (Days)": generator.integer({ min: 1, max: 100 }),
      "Home Number": generator.phone(),
      "Attendance_(%)": generator.integer({ min: 0, max: 100 }),
    })
  )

  const subjectTable = await createTable(apiKey, app._id, {
    schema: {
      Name: {
        name: "Name",
        type: "string",
      },
    },
    name: "Subjects",
    primaryDisplay: "Name",
  })

  const subjects = await batchCreate(
    apiKey,
    app._id,
    SUBJECT_COUNT,
    subjectTable,
    () => ({
      Name: generator.profession(),
    })
  )

  const gradesTable = await createTable(apiKey, app._id, {
    schema: {
      Score: {
        name: "Score",
        type: "number",
      },
      Student: {
        name: "Student",
        tableId: studentsTable._id,
        constraints: {
          presence: true,
          type: "array",
        },
        fieldName: "Grades",
        relationshipType: "one-to-many",
        type: "link",
      },
      Subject: {
        name: "Subject",
        tableId: subjectTable._id,
        constraints: {
          presence: true,
          type: "array",
        },
        fieldName: "Grades",
        relationshipType: "one-to-many",
        type: "link",
      },
    },
    name: "Grades",
  })

  i = 0
  for (const student of students) {
    for (const subject of subjects) {
      await createRow(apiKey, app._id, gradesTable, {
        Score: generator.integer({ min: 0, max: 100 }),
        Student: [student],
        Subject: [subject],
      })
      console.log(
        `Grade ${++i} of ${students.length * subjects.length} created (${
          (Date.now() - start) / 1000
        }s)`
      )
    }
  }
}

run()
  .then(() => {
    console.log(`Done in ${(Date.now() - start) / 1000} seconds`)
  })
  .catch(err => {
    console.error(err)
  })
