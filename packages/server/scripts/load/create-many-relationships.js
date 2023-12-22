#!/bin/node
const yargs = require("yargs")

const Chance = require("chance")

const generator = new Chance()

const STUDENT_COUNT = 500
const SUBJECT_COUNT = 10

const { apiKey, appId } = require("yargs")
  .demandOption(["apiKey"])
  .option("appId").argv

const start = Date.now()
async function batchCreate(apiKey, appId, table, items, batchSize = 1000) {
  let i = 0
  let errors = 0

  async function createSingleRow(item) {
    try {
      const row = await createRow(apiKey, appId, table, item)
      console.log(
        `${table.name} - ${++i} of ${items.length} created (${
          (Date.now() - start) / 1000
        }s)`
      )
      return row
    } catch {
      errors++
    }
  }

  const rows = []
  const maxConcurrency = Math.min(batchSize, items.length)
  const inFlight = {}

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex]
    const promise = createSingleRow(item).then(result => {
      rows.push(result)
      delete inFlight[itemIndex]
    })

    inFlight[itemIndex] = promise

    if (Object.keys(inFlight).length >= maxConcurrency) {
      await Promise.race(Object.values(inFlight))
    }
  }

  await Promise.all(Object.values(inFlight))

  if (errors) {
    console.error(
      `${table.name} - ${errors} creation errored (${
        (Date.now() - start) / 1000
      }s)`
    )
  }

  return rows
}

async function run() {
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
    studentsTable,
    Array.from({ length: STUDENT_COUNT }).map(() => ({
      "Student Number": (++studentNumber).toString(),
      "First Name": generator.first(),
      "Last Name": generator.last(),
      Gender: generator.pickone(["M", "F"]),
      Grade: generator.pickone(["8", "9", "10", "11"]),
      "Tardiness (Days)": generator.integer({ min: 1, max: 100 }),
      "Home Number": generator.phone(),
      "Attendance_(%)": generator.integer({ min: 0, max: 100 }),
    }))
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
    subjectTable,
    Array.from({ length: SUBJECT_COUNT }).map(() => ({
      Name: generator.profession(),
    }))
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

  await batchCreate(
    apiKey,
    app._id,
    gradesTable,
    students.flatMap(student =>
      subjects.map(subject => ({
        Score: generator.integer({ min: 0, max: 100 }),
        Student: [student],
        Subject: [subject],
      }))
    )
  )

  console.log(
    `Access the app here: http://localhost:10000/builder/app/${app._id}`
  )
}

run()
  .then(() => {
    console.log(`Done in ${(Date.now() - start) / 1000} seconds`)
  })
  .catch(err => {
    console.error(err)
  })
