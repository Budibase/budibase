import {
  processStringSync,
  encodeJSBinding,
  defaultJSSetup,
} from "../src/index"
import { UUID_REGEX } from "./constants"
import tk from "timekeeper"

const DATE = "2021-01-21T12:00:00"
tk.freeze(DATE)

const processJS = (js: string, context?: object): any => {
  return processStringSync(encodeJSBinding(js), context)
}

describe("Javascript", () => {
  beforeAll(() => {
    defaultJSSetup()
  })

  describe("Test the JavaScript helper", () => {
    it("should execute a simple expression", () => {
      const output = processJS(`return 1 + 2`)
      expect(output).toBe(3)
    })

    it("should be able to use primitive bindings", () => {
      const output = processJS(`return $("foo")`, {
        foo: "bar",
      })
      expect(output).toBe("bar")
    })

    it("should be able to use an object binding", () => {
      const output = processJS(`return $("foo").bar`, {
        foo: {
          bar: "baz",
        },
      })
      expect(output).toBe("baz")
    })

    it("should be able to use a complex object binding", () => {
      const output = processJS(`return $("foo").bar[0].baz`, {
        foo: {
          bar: [
            {
              baz: "shazbat",
            },
          ],
        },
      })
      expect(output).toBe("shazbat")
    })

    it("should be able to use a deep binding", () => {
      const output = processJS(`return $("foo.bar.baz")`, {
        foo: {
          bar: {
            baz: "shazbat",
          },
        },
      })
      expect(output).toBe("shazbat")
    })

    it("should be able to return an object", () => {
      const output = processJS(`return $("foo")`, {
        foo: {
          bar: {
            baz: "shazbat",
          },
        },
      })
      expect(output.bar.baz).toBe("shazbat")
    })

    it("should be able to return an array", () => {
      const output = processJS(`return $("foo")`, {
        foo: ["a", "b", "c"],
      })
      expect(output[2]).toBe("c")
    })

    it("should be able to return null", () => {
      const output = processJS(`return $("foo")`, {
        foo: null,
      })
      expect(output).toBe(null)
    })

    it("should be able to return undefined", () => {
      const output = processJS(`return $("foo")`, {
        foo: undefined,
      })
      expect(output).toBe(undefined)
    })

    it("should be able to return 0", () => {
      const output = processJS(`return $("foo")`, {
        foo: 0,
      })
      expect(output).toBe(0)
    })

    it("should be able to return an empty string", () => {
      const output = processJS(`return $("foo")`, {
        foo: "",
      })
      expect(output).toBe("")
    })

    it("should be able to use a deep array binding", () => {
      const output = processJS(`return $("foo.0.bar")`, {
        foo: [
          {
            bar: "baz",
          },
        ],
      })
      expect(output).toBe("baz")
    })

    it("should handle errors", () => {
      expect(processJS(`throw "Error"`)).toEqual("Error")
    })

    it("should timeout after one second", () => {
      const output = processJS(`while (true) {}`)
      expect(output).toBe("Timed out while executing JS")
    })

    it("should prevent access to the process global", async () => {
      expect(processJS(`return process`)).toEqual(
        "ReferenceError: process is not defined"
      )
    })
  })

  describe("check JS helpers", () => {
    it("should error if using the format helper. not helpers.", () => {
      expect(processJS(`return helper.toInt(4.3)`)).toEqual(
        "ReferenceError: helper is not defined"
      )
    })

    it("should be able to use toInt", () => {
      const output = processJS(`return helpers.toInt(4.3)`)
      expect(output).toBe(4)
    })

    it("should be able to use uuid", () => {
      const output = processJS(`return helpers.uuid()`)
      expect(output).toMatch(UUID_REGEX)
    })
  })

  describe("JS literal strings", () => {
    it("should be able to handle a literal string that is quoted (like role IDs)", () => {
      const output = processJS(`return $("'Custom'")`)
      expect(output).toBe("Custom")
    })
  })

  describe("mutability", () => {
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
  })

  describe("malice", () => {
    it("should not be able to call JS functions", () => {
      expect(processJS(`return alert("hello")`)).toEqual(
        "ReferenceError: alert is not defined"
      )

      expect(processJS(`return prompt("hello")`)).toEqual(
        "ReferenceError: prompt is not defined"
      )

      expect(processJS(`return confirm("hello")`)).toEqual(
        "ReferenceError: confirm is not defined"
      )

      expect(processJS(`return setTimeout(() => {}, 1000)`)).toEqual(
        "ReferenceError: setTimeout is not defined"
      )

      expect(processJS(`return setInterval(() => {}, 1000)`)).toEqual(
        "ReferenceError: setInterval is not defined"
      )
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
