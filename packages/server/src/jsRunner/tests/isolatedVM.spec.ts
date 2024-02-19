import fs from "fs"
import path from "path"
import { IsolatedVM, VM2 } from "../vm"

function runJSWithIsolatedVM(script: string, context?: any) {
  const runner = new IsolatedVM()
  if (context) {
    runner.withContext(context)
  }
  return runner.execute(`(function(){\n${script}\n})();`)
}

function runJSWithVM2(script: string, context?: any) {
  const runner = new VM2(context)
  return runner.execute(script)
}

function compare(script: string, context?: any) {
  const resultIsolated = runJSWithIsolatedVM(script, context)
  const resultVM = runJSWithVM2(script, context)
  expect(resultIsolated).toEqual(resultVM)
  return resultIsolated
}

describe("Test isolated vm directly", () => {
  it("should handle a very large file", () => {
    const marked = fs.readFileSync(path.join(__dirname, "marked.txt"), "utf-8")
    const result = compare(marked, {
      trigger: { row: { Message: "dddd" } },
    })
    expect(result).toBe("<p>dddd</p>\n")
  })
})
