#!/bin/node
const {
  createApp,
  getTable,
  createRow,
  createTable,
  getApp,
  getRows,
} = require("./utils")

const Chance = require("chance")

const generator = new Chance()

const STUDENT_COUNT = 500
const SUBJECT_COUNT = 10

let { apiKey, appId } = require("yargs")
  .demandOption(["apiKey"])
  .option("appId").argv

const start = Date.now()
async function batchCreate(apiKey, appId, table, items, batchSize = 100) {
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
    const promise = createSingleRow(item)
      .then(result => {
        rows.push(result)
      })
      .finally(() => {
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

const useExistingApp = !!appId

async function upsertTable(appId, tableName, tableData) {
  if (useExistingApp) {
    return await getTable(apiKey, appId, tableName)
  }

  const table = await createTable(apiKey, appId, {
    ...tableData,
    name: tableName,
  })
  return table
}

async function run() {
  if (!appId) {
    const app = appId ? await getApp(apiKey, appId) : await createApp(apiKey)
    appId = app._id

    console.log(`App created. Url: http://localhost:10000/builder/app/${appId}`)
  } else {
    console.log(
      `App retrieved. Url: http://localhost:10000/builder/app/${appId}`
    )
  }

  const studentsTable = await getTable(apiKey, appId, "Students")

  let studentNumber = studentsTable.schema["Auto ID"].lastID
  const students = await batchCreate(
    apiKey,
    appId,
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

  const subjectTable = await upsertTable(appId, "Subjects", {
    schema: {
      Name: {
        name: "Name",
        type: "string",
      },
    },
    primaryDisplay: "Name",
  })

  const subjects = useExistingApp
    ? await getRows(apiKey, appId, subjectTable._id)
    : await batchCreate(
        apiKey,
        appId,
        subjectTable,
        Array.from({ length: SUBJECT_COUNT }).map(() => ({
          Name: generator.profession(),
        }))
      )

  const gradesTable = await upsertTable(appId, "Grades", {
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
  })

  await batchCreate(
    apiKey,
    appId,
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
    `Access the app here: http://localhost:10000/builder/app/${appId}`
  )
}

run()
  .then(() => {
    console.log(`Done in ${(Date.now() - start) / 1000} seconds`)
  })
  .catch(err => {
    console.error(err)
  })
