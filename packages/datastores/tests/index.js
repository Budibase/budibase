import setup from "./setup"
import records from "./records"
import { register } from "./diagnosticPlugin"
import pLimit from "p-limit"
import papa from "papaparse"
import { writeFileSync } from "fs"

const limit = pLimit(1)

const iterateActions = async (apis, getIterator) => {
  const iterator = getIterator(apis)
  let result = iterator()
  while (!result.done) {
    try {
      const runPromises = result.action.iterator(i =>
        limit(() => result.action.run(i))
      )

      let n = 1
      await Promise.all(runPromises)
      result = iterator()
    } catch (e) {
      e.message = `FAILED: ${result.action.name}: ${e.message}`
      throw e
    }
  }
}

export default async (datastore, config) => {
  const apis = await setup(datastore)

  const diagnostics = []
  let currentRecordCount = 0

  register(
    apis,
    (ev, elapsed, info) => {
      if (ev === "recordApi:save:onComplete") {
        currentRecordCount++
      } else if (ev === "recordApi:delete:onComplete") {
        currentRecordCount--
      }
      diagnostics.push({ method: ev, elapsed, info, count: currentRecordCount })
      console.log(`${ev}    ${info}    ${elapsed / 1000} s`)
    },
    [
      "recordApi:save",
      "recordApi:load",
      "viewApi:listItems",
      "recordApi:delete",
    ]
  )

  await iterateActions(apis, records)

  const diagnosticscsv = papa.unparse(diagnostics)

  writeFileSync(config.root + "\\results.csv", diagnosticscsv, {
    encoding: "utf8",
  })
}
