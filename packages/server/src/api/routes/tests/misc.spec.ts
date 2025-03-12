import { handleDataImport } from "../../controllers/table/utils"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { AutoFieldSubType, FieldType, JsonFieldSubType } from "@budibase/types"

describe("run misc tests", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  beforeAll(async () => {
    await config.init()
  })

  describe("/bbtel", () => {
    it("check if analytics enabled", async () => {
      const { enabled } = await config.api.misc.bbtel()
      expect(enabled).toEqual(true)
    })
  })

  describe("/health", () => {
    it("should confirm healthy", async () => {
      await config.api.misc.health()
    })
  })

  describe("/version", () => {
    it("should confirm version", async () => {
      const version = await config.api.misc.version()
      if (version.includes("alpha")) {
        expect(version.split(".").length).toEqual(4)
      } else {
        expect(version.split(".").length).toEqual(3)
      }
    })
  })

  describe("test table utilities", () => {
    it("should be able to import data", async () => {
      return config.doInContext("", async () => {
        const table = await config.createTable({
          name: "table",
          type: "table",
          schema: {
            a: {
              type: FieldType.STRING,
              name: "a",
              constraints: {
                type: "string",
              },
            },
            b: {
              name: "b",
              type: FieldType.STRING,
              constraints: {
                type: "string",
              },
            },
            c: {
              name: "c",
              type: FieldType.STRING,
              constraints: {
                type: "string",
              },
            },
            d: {
              name: "d",
              type: FieldType.STRING,
              constraints: {
                type: "string",
              },
            },
            e: {
              name: "Auto ID",
              type: FieldType.NUMBER,
              subtype: AutoFieldSubType.AUTO_ID,
              icon: "ri-magic-line",
              autocolumn: true,
              constraints: {
                type: "number",
                presence: false,
                numericality: {
                  greaterThanOrEqualTo: "",
                  lessThanOrEqualTo: "",
                },
              },
            },
            f: {
              type: FieldType.ARRAY,
              constraints: {
                type: JsonFieldSubType.ARRAY,
                presence: {
                  allowEmpty: true,
                },
                inclusion: ["One", "Two", "Three"],
              },
              name: "Sample Tags",
              sortable: false,
            },
            g: {
              type: FieldType.OPTIONS,
              constraints: {
                type: "string",
                presence: false,
                inclusion: ["Alpha", "Beta", "Gamma"],
              },
              name: "Sample Opts",
            },
          },
        })

        const importRows = [
          { a: "1", b: "2", c: "3", d: "4", f: "['One']", g: "Alpha" },
          { a: "5", b: "6", c: "7", d: "8", f: "[]", g: undefined },
          { a: "9", b: "10", c: "11", d: "12", f: "['Two','Four']", g: "" },
          { a: "13", b: "14", c: "15", d: "16", g: "Omega" },
        ]
        // Shift specific row tests to the row spec
        await handleDataImport(table, { importRows, userId: "test" })

        // 4 rows imported, the auto ID starts at 1
        // We expect the handleDataImport function to update the lastID

        // @ts-expect-error - fields have type FieldSchema, not specific
        // subtypes.
        expect(table.schema.e.lastID).toEqual(4)

        // Array/Multi - should have added a new value to the inclusion.
        // @ts-expect-error - fields have type FieldSchema, not specific
        // subtypes.
        expect(table.schema.f.constraints.inclusion).toEqual([
          "Four",
          "One",
          "Three",
          "Two",
        ])

        // Options - should have a new value in the inclusion
        // @ts-expect-error - fields have type FieldSchema, not specific
        // subtypes.
        expect(table.schema.g.constraints.inclusion).toEqual([
          "Alpha",
          "Beta",
          "Gamma",
          "Omega",
        ])

        const rows = await config.api.row.fetch(table._id!)
        expect(rows.length).toEqual(4)

        const rowOne = rows.find(row => row.e === 1)!
        expect(rowOne.a).toEqual("1")
        expect(rowOne.f).toEqual(["One"])
        expect(rowOne.g).toEqual("Alpha")

        const rowTwo = rows.find(row => row.e === 2)!
        expect(rowTwo.a).toEqual("5")
        expect(rowTwo.f).toEqual([])
        expect(rowTwo.g).toEqual(undefined)

        const rowThree = rows.find(row => row.e === 3)!
        expect(rowThree.a).toEqual("9")
        expect(rowThree.f).toEqual(["Two", "Four"])
        expect(rowThree.g).toEqual(undefined)

        const rowFour = rows.find(row => row.e === 4)!
        expect(rowFour.a).toEqual("13")
        expect(rowFour.f).toEqual(undefined)
        expect(rowFour.g).toEqual("Omega")
      })
    })
  })
})
