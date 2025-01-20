import {
  processStringWithLogsSync,
  encodeJSBinding,
  defaultJSSetup,
} from "../src/index"

const processJS = (js: string, context?: object) => {
  return processStringWithLogsSync(encodeJSBinding(js), context)
}

describe("Javascript", () => {
  beforeAll(() => {
    defaultJSSetup()
  })

  describe("Test logging in JS bindings", () => {
    it("should execute a simple expression", () => {
      const output = processJS(
        `console.log("hello"); 
         console.log("world"); 
         console.log("foo"); 
         return "hello"`
      )
      expect(output.result).toEqual("hello")
      expect(output.logs[0].log).toEqual(["hello"])
      expect(output.logs[0].line).toEqual(1)
      expect(output.logs[1].log).toEqual(["world"])
      expect(output.logs[1].line).toEqual(2)
      expect(output.logs[2].log).toEqual(["foo"])
      expect(output.logs[2].line).toEqual(3)
    })
  })

  it("should log comma separated values", () => {
    const output = processJS(`console.log(1, { a: 1 }); return 1`)
    expect(output.logs[0].log).toEqual([1, JSON.stringify({ a: 1 })])
    expect(output.logs[0].line).toEqual(1)
  })

  it("should return the type working with warn", () => {
    const output = processJS(`console.warn("warning"); return 1`)
    expect(output.logs[0].log).toEqual(["warning"])
    expect(output.logs[0].line).toEqual(1)
    expect(output.logs[0].type).toEqual("warn")
  })

  it("should return the type working with error", () => {
    const output = processJS(`console.error("error"); return 1`)
    expect(output.logs[0].log).toEqual(["error"])
    expect(output.logs[0].line).toEqual(1)
    expect(output.logs[0].type).toEqual("error")
  })
})
