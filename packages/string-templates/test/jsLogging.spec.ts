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
      expect(output.result).toBe("hello")
      expect(output.logs[0].log).toBe("hello")
      expect(output.logs[0].line).toBe(1)
      expect(output.logs[1].log).toBe("world")
      expect(output.logs[1].line).toBe(2)
      expect(output.logs[2].log).toBe("foo")
      expect(output.logs[2].line).toBe(3)
    })
  })
})
