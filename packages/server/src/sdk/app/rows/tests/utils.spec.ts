import dayjs from "dayjs"
import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
} from "@budibase/types"
import { generateTableID } from "../../../../db/utils"
import { validate } from "../utils"
import { generator } from "@budibase/backend-core/tests"
import { withEnv } from "../../../../environment"

describe("validate", () => {
  const hour = () => generator.hour().toString().padStart(2, "0")
  const minute = () => generator.minute().toString().padStart(2, "0")
  const second = minute

  describe("time only", () => {
    const getTable = (): Table => ({
      type: "table",
      _id: generateTableID(),
      name: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        time: {
          name: "time",
          type: FieldType.DATETIME,
          timeOnly: true,
        },
      },
    })

    it("should accept empty values", async () => {
      const row = {}
      const table = getTable()
      const output = await validate({ source: table, row })
      expect(output.valid).toBe(true)
      expect(output.errors).toEqual({})
    })

    it("should accept valid times with HH:mm format", async () => {
      const row = {
        time: `${hour()}:${minute()}`,
      }
      const table = getTable()
      const output = await validate({ source: table, row })
      expect(output.valid).toBe(true)
    })

    it("should accept valid times with HH:mm:ss format", async () => {
      const row = {
        time: `${hour()}:${minute()}:${second()}`,
      }
      const table = getTable()
      const output = await validate({ source: table, row })
      expect(output.valid).toBe(true)
    })

    it.each([
      ["ISO datetimes", generator.date().toISOString()],
      ["random values", generator.word()],
    ])("should reject %s", async (_, time) => {
      const row = {
        time,
      }
      const table = getTable()
      table.schema.time.constraints = {
        presence: true,
      }
      const output = await validate({ source: table, row })
      expect(output.valid).toBe(false)
      expect(output.errors).toEqual({ time: ['"time" is not a valid time'] })
    })

    describe("time constraints", () => {
      describe("earliest only", () => {
        const table = getTable()
        table.schema.time.constraints = {
          presence: true,
          datetime: {
            earliest: "10:00",
            latest: "",
          },
        }

        it.each([
          "10:00",
          "15:00",
          `10:${minute()}`,
          "12:34",
          `${generator.integer({ min: 11, max: 23 })}:${minute()}`,
        ])("should accept values after config value (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(true)
        })

        it.each([
          "09:59:59",
          `${generator.integer({ min: 0, max: 9 })}:${minute()}`,
        ])("should reject values before config value (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(false)
          expect(output.errors).toEqual({
            time: ["must be no earlier than 10:00"],
          })
        })
      })

      describe("latest only", () => {
        const table = getTable()
        table.schema.time.constraints = {
          presence: true,
          datetime: {
            earliest: "",
            latest: "15:16:17",
          },
        }

        it.each([
          "15:16:17",
          "15:16",
          "15:00",
          `${generator.integer({ min: 0, max: 12 })}:${minute()}`,
        ])("should accept values before config value (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(true)
        })

        it.each([
          "15:16:18",
          `${generator.integer({ min: 16, max: 23 })}:${minute()}`,
        ])("should reject values after config value (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(false)
          expect(output.errors).toEqual({
            time: ["must be no later than 15:16:17"],
          })
        })
      })

      describe("range", () => {
        const table = getTable()
        table.schema.time.constraints = {
          presence: true,
          datetime: {
            earliest: "10:00",
            latest: "15:00",
          },
        }

        it.each(["10:00", "15:00", `10:${minute()}`, "12:34"])(
          "should accept values in range (%s)",
          async time => {
            const row = { time }
            const output = await validate({ source: table, row })
            expect(output.valid).toBe(true)
          }
        )

        it.each([
          "9:59:50",
          `${generator.integer({ min: 0, max: 9 })}:${minute()}`,
        ])("should reject values before range (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(false)
          expect(output.errors).toEqual({
            time: ["must be no earlier than 10:00"],
          })
        })

        it.each([
          "15:00:01",
          `${generator.integer({ min: 16, max: 23 })}:${minute()}`,
        ])("should reject values after range (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(false)
          expect(output.errors).toEqual({
            time: ["must be no later than 15:00"],
          })
        })

        describe("range crossing midnight", () => {
          const table = getTable()
          table.schema.time.constraints = {
            presence: true,
            datetime: {
              earliest: "15:00",
              latest: "10:00",
            },
          }

          it.each(["10:00", "15:00", `9:${minute()}`, "16:34", "00:00"])(
            "should accept values in range (%s)",
            async time => {
              const row = { time }
              const output = await validate({ source: table, row })
              expect(output.valid).toBe(true)
            }
          )

          it.each(["10:01", "14:59:59", `12:${minute()}`])(
            "should reject values out range (%s)",
            async time => {
              const row = { time }
              const output = await validate({ source: table, row })
              expect(output.valid).toBe(false)
              expect(output.errors).toEqual({
                time: ["must be no later than 10:00"],
              })
            }
          )
        })
      })
    })

    describe("required", () => {
      it("should reject empty values", async () => {
        const row = {}
        const table = getTable()
        table.schema.time.constraints = {
          presence: true,
        }
        const output = await validate({ source: table, row })
        expect(output.valid).toBe(false)
        expect(output.errors).toEqual({ time: ["can't be blank"] })
      })

      it.each([undefined, null])("should reject %s values", async time => {
        const row = { time }
        const table = getTable()
        table.schema.time.constraints = {
          presence: true,
        }
        const output = await validate({ source: table, row })
        expect(output.valid).toBe(false)
        expect(output.errors).toEqual({ time: ["can't be blank"] })
      })
    })

    describe("range", () => {
      const table = getTable()
      table.schema.time.constraints = {
        presence: true,
        datetime: {
          earliest: "10:00",
          latest: "15:00",
        },
      }

      it.each(["10:00", "15:00", `10:${minute()}`, "12:34"])(
        "should accept values in range (%s)",
        async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(true)
        }
      )

      it.each([
        "9:59:50",
        `${generator.integer({ min: 0, max: 9 })}:${minute()}`,
      ])("should reject values before range (%s)", async time => {
        const row = { time }
        const output = await validate({ source: table, row })
        expect(output.valid).toBe(false)
        expect(output.errors).toEqual({
          time: ["must be no earlier than 10:00"],
        })
      })

      it.each([
        "15:00:01",
        `${generator.integer({ min: 16, max: 23 })}:${minute()}`,
      ])("should reject values after range (%s)", async time => {
        const row = { time }
        const output = await validate({ source: table, row })
        expect(output.valid).toBe(false)
        expect(output.errors).toEqual({
          time: ["must be no later than 15:00"],
        })
      })

      describe("datetime ISO configs", () => {
        const table = getTable()

        table.schema.time.constraints = {
          presence: true,
          datetime: {
            earliest: dayjs().hour(10).minute(0).second(0).toISOString(),
            latest: dayjs().hour(15).minute(0).second(0).toISOString(),
          },
        }

        it.each(["10:00", "15:00", `12:${minute()}`])(
          "should accept values in range (%s)",
          async time => {
            const row = { time }
            const output = await validate({ source: table, row })
            expect(output.valid).toBe(true)
          }
        )

        it.each([
          "09:59:50",
          `${generator.integer({ min: 0, max: 9 })}:${minute()}`,
        ])("should reject values before range (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(false)
          expect(output.errors).toEqual({
            time: ["must be no earlier than 10:00"],
          })
        })

        it.each([
          "15:00:01",
          `${generator.integer({ min: 16, max: 23 })}:${minute()}`,
        ])("should reject values after range (%s)", async time => {
          const row = { time }
          const output = await validate({ source: table, row })
          expect(output.valid).toBe(false)
          expect(output.errors).toEqual({
            time: ["must be no later than 15:00"],
          })
        })
      })
    })
  })

  describe("XSS Safe mode", () => {
    const getTable = (): Table => ({
      type: "table",
      _id: generateTableID(),
      name: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        text: {
          name: "sometext",
          type: FieldType.STRING,
        },
      },
    })
    it.each([
      "SELECT * FROM users WHERE username = 'admin' --",
      "SELECT * FROM users WHERE id = 1; DROP TABLE users;",
      "1' OR '1' = '1",
      "' OR 'a' = 'a",
      "<script>alert('XSS');</script>",
      '"><img src=x onerror=alert(1)>',
      "</script><script>alert('test')</script>",
      "<div onmouseover=\"alert('XSS')\">Hover over me!</div>",
      "'; EXEC sp_msforeachtable 'DROP TABLE ?'; --",
      "{alert('Injected')}",
      "UNION SELECT * FROM users",
      "INSERT INTO users (username, password) VALUES ('admin', 'password')",
      "/* This is a comment */ SELECT * FROM users",
      '<iframe src="http://malicious-site.com"></iframe>',
    ])("test potentially unsafe input: %s", async input => {
      await withEnv({ XSS_SAFE_MODE: "1" }, async () => {
        const table = getTable()
        const row = { text: input }
        const output = await validate({ source: table, row })
        expect(output.valid).toBe(false)
        expect(output.errors).toStrictEqual({
          text: ["Input not sanitised - potentially vulnerable to XSS"],
        })
      })
    })
  })
})
