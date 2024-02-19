import { validate as isValidUUID } from "uuid"
import { processStringSync, encodeJSBinding } from "@budibase/string-templates"
import fs from "fs"
import path from "path"

const { runJsHelpersTests } = require("@budibase/string-templates/test/utils")

import tk from "timekeeper"
import { init } from ".."
import TestConfiguration from "../../tests/utilities/TestConfiguration"

tk.freeze("2021-01-21T12:00:00")

describe("jsRunner (using isolated-vm)", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    // Register js runner
    init()
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  const processJS = (js: string, context?: object) => {
    return config.doInContext(config.getAppId(), async () =>
      processStringSync(encodeJSBinding(js), context || {})
    )
  }

  it("it can run a basic javascript", async () => {
    const output = await processJS(`return 1 + 2`)
    expect(output).toBe(3)
  })

  it("it can execute sloppy javascript", async () => {
    const output = await processJS(`a=2;b=3;return a + b`)
    expect(output).toBe(5)
  })

  it("should prevent sandbox escape", async () => {
    const output = await processJS(
      `return this.constructor.constructor("return process.env")()`
    )
    expect(output).toBe("Error while executing JS")
  })

  describe("helpers", () => {
    runJsHelpersTests({
      funcWrap: (func: any) => config.doInContext(config.getAppId(), func),
      testsToSkip: ["random", "uuid"],
    })

    describe("uuid", () => {
      it("uuid helper returns a valid uuid", async () => {
        const result = await processJS("return helpers.uuid()")
        expect(result).toBeDefined()
        expect(isValidUUID(result)).toBe(true)
      })
    })

    describe("random", () => {
      it("random helper returns a valid number", async () => {
        const min = 1
        const max = 8
        const result = await processJS(`return helpers.random(${min}, ${max})`)
        expect(result).toBeDefined()
        expect(result).toBeGreaterThanOrEqual(min)
        expect(result).toBeLessThanOrEqual(max)
      })
    })
  })

  // the test cases here were extracted from templates/real world examples of JS in Budibase
  describe("should real world tests of JS", () => {
    const context = {
      "Unit Value": 2,
      Quantity: 1,
    }
    it("handle test case 1", async () => {
      const result = await processJS(
        `
        var Gross = $("[Unit Value]") * $("[Quantity]")
        return Gross.toFixed(2)`,
        context
      )
      expect(result).toBeDefined()
      expect(result).toBe("2.00")
    })

    it("handle test case 2", async () => {
      const context = {
        "Purchase Date": "2021-01-21T12:00:00",
      }
      const result = await processJS(
        `
        var purchase = new Date($("[Purchase Date]"));
        let purchaseyear = purchase.getFullYear();
        let purchasemonth = purchase.getMonth();

        var today = new Date ();
        let todayyear = today.getFullYear();
        let todaymonth = today.getMonth();

        var age = todayyear - purchaseyear

        if (((todaymonth - purchasemonth) < 6) == true){
          return age
        }
        `,
        context
      )
      expect(result).toBeDefined()
      expect(result).toBe(3)
    })

    it("should handle test case 3", async () => {
      const context = {
        Escalate: true,
        "Budget ($)": 1100,
      }
      const result = await processJS(
        `
        if ($("[Escalate]") == true) {
          if ($("Budget ($)") <= 1000)
            {return 2;}
          if ($("Budget ($)") > 1000) 
            {return 3;}
          }
          else {
            if ($("Budget ($)") <= 1000)
              {return 1;}
            if ($("Budget ($)") > 1000)
              if ($("Budget ($)") < 10000) 
                {return 2;}
              else 
                {return 3}
          }
        `,
        context
      )
      expect(result).toBeDefined()
      expect(result).toBe(3)
    })
  })
})
