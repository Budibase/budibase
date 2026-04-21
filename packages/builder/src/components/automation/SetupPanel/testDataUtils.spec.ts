import { describe, expect, it } from "vitest"
import {
  type AutomationTrigger,
  AutomationEventType,
  AutomationIOType,
} from "@budibase/types"
import {
  buildTriggerSchemaProperties,
  getTriggerTableId,
  isTriggerValidForTestData,
  normalizeParsedJsonForTrigger,
  parseTestDataForTrigger,
} from "./testDataUtils"

const createTrigger = (
  overrides: Omit<Partial<AutomationTrigger>, "schema"> & {
    schema?: Partial<AutomationTrigger["schema"]>
  } = {}
): AutomationTrigger => {
  const defaultSchema = {
    inputs: {
      properties: {},
      required: [],
    },
    outputs: {
      properties: {},
      required: [],
    },
  }

  return {
    event: AutomationEventType.APP_TRIGGER,
    inputs: {},
    schema: {
      ...defaultSchema,
      ...(overrides.schema || {}),
      inputs: {
        ...defaultSchema.inputs,
        ...(overrides.schema?.inputs || {}),
      },
      outputs: {
        ...defaultSchema.outputs,
        ...(overrides.schema?.outputs || {}),
      },
    },
    ...overrides,
  } as AutomationTrigger
}

describe("testDataUtils", () => {
  describe("getTriggerTableId", () => {
    it("returns the table id when present as a string", () => {
      const trigger = createTrigger({
        event: AutomationEventType.ROW_SAVE,
        inputs: { tableId: "table_1" } as AutomationTrigger["inputs"],
      })

      expect(getTriggerTableId(trigger)).toBe("table_1")
    })

    it("returns undefined when table id is missing or not a string", () => {
      const missing = createTrigger({
        event: AutomationEventType.ROW_SAVE,
        inputs: {} as AutomationTrigger["inputs"],
      })
      const notString = createTrigger({
        event: AutomationEventType.ROW_SAVE,
        inputs: { tableId: 123 } as unknown as AutomationTrigger["inputs"],
      })

      expect(getTriggerTableId(missing)).toBeUndefined()
      expect(getTriggerTableId(notString)).toBeUndefined()
    })
  })

  describe("parseTestDataForTrigger", () => {
    it("resets core row data when row trigger table id does not match", () => {
      const trigger = createTrigger({
        event: AutomationEventType.ROW_UPDATE,
        inputs: { tableId: "table_1" } as AutomationTrigger["inputs"],
      })
      const source = {
        row: { tableId: "table_2", name: "old" },
        meta: { fields: { name: {} } },
        id: "abc",
        revision: "1-xyz",
      }

      expect(parseTestDataForTrigger(trigger, source)).toEqual({
        row: { tableId: "table_1" },
        meta: {},
        id: "",
        revision: "",
      })
    })

    it("returns a deep clone when data is already valid", () => {
      const trigger = createTrigger({
        event: AutomationEventType.ROW_SAVE,
        inputs: { tableId: "table_1" } as AutomationTrigger["inputs"],
      })
      const source = {
        row: { tableId: "table_1", nested: { value: "a" } },
      }

      const result = parseTestDataForTrigger(trigger, source)
      expect(result).toEqual(source)
      expect(result).not.toBe(source)
      expect((result as { row?: unknown }).row).not.toBe(source.row)
    })
  })

  describe("isTriggerValidForTestData", () => {
    it("is false for row triggers without table id", () => {
      const trigger = createTrigger({
        event: AutomationEventType.ROW_DELETE,
        inputs: {} as AutomationTrigger["inputs"],
      })

      expect(isTriggerValidForTestData(trigger)).toBe(false)
    })

    it("is true for row triggers with table id and non-row triggers", () => {
      const rowTrigger = createTrigger({
        event: AutomationEventType.ROW_DELETE,
        inputs: { tableId: "table_1" } as AutomationTrigger["inputs"],
      })
      const appTrigger = createTrigger({
        event: AutomationEventType.APP_TRIGGER,
        inputs: {} as AutomationTrigger["inputs"],
      })

      expect(isTriggerValidForTestData(rowTrigger)).toBe(true)
      expect(isTriggerValidForTestData(appTrigger)).toBe(true)
    })
  })

  describe("normalizeParsedJsonForTrigger", () => {
    it("forces row.tableId for row triggers and does not mutate the original", () => {
      const trigger = createTrigger({
        event: AutomationEventType.ROW_ACTION,
        inputs: { tableId: "table_1" } as AutomationTrigger["inputs"],
      })
      const source = { row: { tableId: "wrong" }, data: { a: 1 } }

      const result = normalizeParsedJsonForTrigger(trigger, source)
      expect(result).toEqual({
        row: { tableId: "table_1" },
        data: { a: 1 },
      })
      expect(source).toEqual({ row: { tableId: "wrong" }, data: { a: 1 } })
    })

    it("adds a row object when missing for row triggers", () => {
      const trigger = createTrigger({
        event: AutomationEventType.ROW_SAVE,
        inputs: { tableId: "table_99" } as AutomationTrigger["inputs"],
      })

      expect(
        normalizeParsedJsonForTrigger(trigger, { hello: "world" })
      ).toEqual({
        hello: "world",
        row: { tableId: "table_99" },
      })
    })
  })

  describe("buildTriggerSchemaProperties", () => {
    it("returns schema properties for non-app triggers", () => {
      const trigger = createTrigger({
        event: AutomationEventType.ROW_SAVE,
        schema: {
          outputs: {
            properties: {
              row: { type: AutomationIOType.OBJECT },
              meta: { type: AutomationIOType.OBJECT },
            },
            required: [],
          },
        },
      })

      expect(buildTriggerSchemaProperties(trigger)).toEqual([
        ["row", { type: AutomationIOType.OBJECT }],
        ["meta", { type: AutomationIOType.OBJECT }],
      ])
    })

    it("returns the fields custom type for app trigger", () => {
      const trigger = createTrigger({
        event: AutomationEventType.APP_TRIGGER,
      })

      expect(buildTriggerSchemaProperties(trigger)).toEqual([
        ["fields", { customType: "fields" }],
      ])
    })
  })
})
