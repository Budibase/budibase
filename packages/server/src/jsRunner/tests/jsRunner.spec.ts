import { validate as isValidUUID } from "uuid"
import { processStringSync, encodeJSBinding } from "@budibase/string-templates"

import { runJsHelpersTests } from "@budibase/string-templates/test/utils"

import tk from "timekeeper"
import { init } from ".."
import TestConfiguration from "../../tests/utilities/TestConfiguration"

const DATE = "2021-01-21T12:00:00"
tk.freeze(DATE)

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

  it("can run a basic javascript", async () => {
    const output = await processJS(`return 1 + 2`)
    expect(output).toBe(3)
  })

  it("can execute sloppy javascript", async () => {
    const output = await processJS(`a=2;b=3;return a + b`)
    expect(output).toBe(5)
  })

  it("should prevent sandbox escape", async () => {
    expect(
      await processJS(
        `return this.constructor.constructor("return process.env")()`
      )
    ).toEqual("ReferenceError: process is not defined")
  })

  it("should not allow the context to be mutated", async () => {
    const context = { array: [1] }
    const result = await processJS(
      `
        const array = $("array");
        array.push(2);
        return array[1]
      `,
      context
    )
    expect(result).toEqual(2)
    expect(context.array).toEqual([1])
  })

  it("should copy values whenever returning them from $", async () => {
    const context = { array: [1] }
    const result = await processJS(
      `
        $("array").push(2);
        return $("array")[1];
      `,
      context
    )
    expect(result).toEqual(undefined)
    expect(context.array).toEqual([1])
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

    describe("buffer", () => {
      it("handle a buffer", async () => {
        const base64 = Buffer.from("hello").toString("base64")
        const result = await processJS(
          `return Buffer.from("${base64}", "base64").toString("utf8")`
        )
        expect(result).toBeDefined()
        expect(result).toEqual("hello")
      })
    })
  })

  // the test cases here were extracted from templates/real world examples of JS in Budibase
  describe("real test cases from Budicloud", () => {
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
      const todayDate = new Date()
      // add a year and a month
      todayDate.setMonth(new Date().getMonth() + 1)
      todayDate.setFullYear(todayDate.getFullYear() + 1)
      const context = {
        "Purchase Date": DATE,
        today: todayDate.toISOString(),
      }
      const result = await processJS(
        `
        var purchase = new Date($("[Purchase Date]"));
        let purchaseyear = purchase.getFullYear();
        let purchasemonth = purchase.getMonth();

        var today = new Date($("today"));
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
      expect(result).toBe(1)
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

    it("should handle test case 4", async () => {
      const context = {
        "Time Sheets": ["a", "b"],
      }
      const result = await processJS(
        `
      let hours = 0
      if (($("[Time Sheets]") != null) == true){
        for (i = 0; i < $("[Time Sheets]").length; i++){
          let hoursLogged = "Time Sheets." + i + ".Hours"
          hours += $(hoursLogged)
        }
        return hours
      }
      if (($("[Time Sheets]") != null) == false){
        return hours
      }
      `,
        context
      )
      expect(result).toBeDefined()
      expect(result).toBe("0ab")
    })

    it("should handle test case 5", async () => {
      const context = {
        change: JSON.stringify({ a: 1, primaryDisplay: "a" }),
        previous: JSON.stringify({ a: 2, primaryDisplay: "b" }),
      }
      const result = await processJS(
        `
      let change = $("[change]") ? JSON.parse($("[change]")) : {}
      let previous = $("[previous]") ? JSON.parse($("[previous]")) : {}

      function simplifyLink(originalKey, value, parent) {
        if (Array.isArray(value)) {
          if (value.filter(item => Object.keys(item || {}).includes("primaryDisplay")).length > 0) {
            parent[originalKey] = value.map(link => link.primaryDisplay)
          }
        }
      }

      for (let entry of Object.entries(change)) {
        simplifyLink(entry[0], entry[1], change)
      }
      for (let entry of Object.entries(previous)) {
        simplifyLink(entry[0], entry[1], previous)
      }
      
      let diff = Object.fromEntries(Object.entries(change).filter(([k, v]) => previous[k]?.toString() !== v?.toString()))
      
      delete diff.audit_change
      delete diff.audit_previous
      delete diff._id
      delete diff._rev
      delete diff.tableId
      delete diff.audit
      
      for (let entry of Object.entries(diff)) {
        simplifyLink(entry[0], entry[1], diff)
      }
      
      return JSON.stringify(change)?.replaceAll(",\\"", ",\\n\\t\\"").replaceAll("{\\"", "{\\n\\t\\"").replaceAll("}", "\\n}")
      `,
        context
      )
      expect(result).toBe(`{\n\t"a":1,\n\t"primaryDisplay":"a"\n}`)
    })

    it("should handle test case 6", async () => {
      const context = {
        "Join Date": DATE,
      }
      const result = await processJS(
        `
        var rate = 5;
        var today = new Date();
        
        // comment
        function monthDiff(dateFrom, dateTo) {
         return dateTo.getMonth() - dateFrom.getMonth() + 
           (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
        }
        var serviceMonths = monthDiff( new Date($("[Join Date]")), today);
        var serviceYears = serviceMonths / 12;
        
        if (serviceYears >= 1 && serviceYears < 5){
          rate = 10;
        }
        if (serviceYears >= 5 && serviceYears < 10){
          rate = 15;
        }
        if (serviceYears >= 10){
          rate = 15;
          rate += 0.5 * (Number(serviceYears.toFixed(0)) - 10);
        }
        return rate;
        `,
        context
      )
      expect(result).toBe(10)
    })

    it("should handle test case 7", async () => {
      const context = {
        "P I": "Pass",
        "PA I": "Pass",
        "F I": "Fail",
        "V I": "Pass",
      }
      const result = await processJS(
        `if (($("[P I]") == "Pass") == true)
              if (($("[  P I]") == "Pass") == true)
                if (($("[F I]") == "Pass") == true)
                  if (($("[V I]") == "Pass") == true)
                    {return "Pass"}
            
            if (($("[PA I]") == "Fail") == true)
              {return "Fail"}
            if (($("[  P I]") == "Fail") == true)
              {return "Fail"}
            if (($("[F I]") == "Fail") == true)
              {return "Fail"}
            if (($("[V I]") == "Fail") == true)
              {return "Fail"}
            
            else
              {return ""}`,
        context
      )
      expect(result).toBe("Fail")
    })

    it("should handle test case 8", async () => {
      const context = {
        "T L": [{ Hours: 10 }],
        "B H": 50,
      }
      const result = await processJS(
        `var totalHours = 0;
            if (($("[T L]") != null) == true){
            for (let i = 0; i < ($("[T L]").length); i++){
              var individualHours = "T L." + i + ".Hours";
              var hoursNum = Number($(individualHours));
              totalHours += hoursNum;
            }
            return totalHours.toFixed(2);
            }
            if (($("[T L]") != null) == false) {
              return totalHours.toFixed(2);
            }
        `,
        context
      )
      expect(result).toBe("10.00")
    })

    it("should handle test case 9", async () => {
      const context = {
        "T L": [{ Hours: 10 }],
        "B H": 50,
      }
      const result = await processJS(
        `var totalHours = 0;
            if (($("[T L]") != null) == true){
            for (let i = 0; i < ($("[T L]").length); i++){
              var individualHours = "T L." + i + ".Hours";
              var hoursNum = Number($(individualHours));
              totalHours += hoursNum;
            }
            return ($("[B H]") - totalHours).toFixed(2);
            }
            if (($("[T L]") != null) == false) {
              return ($("[B H]") - totalHours).toFixed(2);
            }`,
        context
      )
      expect(result).toBe("40.00")
    })

    it("should handle test case 10", async () => {
      const context = {
        "F F": [{ "F S": 10 }],
      }
      const result = await processJS(
        `var rating = 0;
          
          if ($("[F F]") != null){
          for (i = 0; i < $("[F F]").length; i++){
            var individualRating = $("F F." + i + ".F S");
            rating += individualRating;
            }
            rating = (rating / $("[F F]").length);
          }
          return rating;
          `,
        context
      )
      expect(result).toBe(10)
    })
  })
})
