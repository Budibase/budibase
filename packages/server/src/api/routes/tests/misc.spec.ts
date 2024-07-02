import {
  AutoFieldSubType,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  TableSourceType,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { handleDataImport } from "../../controllers/table/utils"

describe("run misc tests", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  describe("/bbtel", () => {
    it("check if analytics enabled", async () => {
      const res = await config
        .request!.get(`/api/bbtel`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(typeof res.body.enabled).toEqual("boolean")
    })
  })

  describe("/health", () => {
    it("should confirm healthy", async () => {
      await config.request!.get("/health").expect(200)
    })
  })

  describe("/version", () => {
    it("should confirm version", async () => {
      const res = await config.request!.get("/version").expect(200)
      const text = res.text
      if (text.includes("alpha")) {
        expect(text.split(".").length).toEqual(4)
      } else {
        expect(text.split(".").length).toEqual(3)
      }
    })
  })

  describe("test table utilities", () => {
    it("should be able to import data", async () => {
      return config.doInContext(undefined, async () => {
        const table = await config.api.table.save({
          name: "table",
          type: "table",
          sourceType: TableSourceType.INTERNAL,
          sourceId: INTERNAL_TABLE_SOURCE_ID,
          schema: {
            a: {
              name: "a",
              type: FieldType.STRING,
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
                type: "array",
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
        await handleDataImport(table, {
          importRows,
          user: { userId: "test" } as any,
        })

        // 4 rows imported, the auto ID starts at 1
        // We expect the handleDataImport function to update the lastID
        expect((table.schema.e as any).lastID).toEqual(4)

        // Array/Multi - should have added a new value to the inclusion.
        expect(table.schema.f.constraints!.inclusion).toEqual([
          "Four",
          "One",
          "Three",
          "Two",
        ])

        // Options - should have a new value in the inclusion
        expect(table.schema.g.constraints!.inclusion).toEqual([
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
        expect(rowThree.g).toEqual(null)

        const rowFour = rows.find(row => row.e === 4)!
        expect(rowFour.a).toEqual("13")
        expect(rowFour.f).toEqual(undefined)
        expect(rowFour.g).toEqual("Omega")
      })
    })
  })
})
