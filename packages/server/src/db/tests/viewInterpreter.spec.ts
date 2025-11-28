import { DBView, Row, ViewTemplateOpts } from "@budibase/types"
import { buildMapFunction } from "../viewInterpreter"

const baseMeta = (overrides: Partial<ViewTemplateOpts> = {}): ViewTemplateOpts => ({
  field: "score",
  tableId: "table_1",
  filters: [],
  schema: {},
  ...overrides,
})

const buildView = (metaOverrides: Partial<ViewTemplateOpts> = {}): DBView => ({
  map: "",
  meta: baseMeta(metaOverrides),
})

describe("viewInterpreter", () => {
  it("emits rows when table and filters match", () => {
    const view = buildView({
      groupBy: "group",
      filters: [
        {
          key: "status",
          condition: "EQUALS",
          value: "open",
        },
      ],
    })
    const emitSpy: Array<[any, any]> = []
    const emit = (key: any, value?: any) => emitSpy.push([key, value])
    const doc: Row = {
      _id: "ro_1",
      tableId: "table_1",
      group: "alpha",
      status: "open",
      score: 5,
    }

    const fn = buildMapFunction(view)
    fn(doc, emit)

    expect(emitSpy).toEqual([["alpha", 5]])
  })

  it("skips documents missing calculation field values", () => {
    const view = buildView({ calculation: "sum" })
    const emit = jest.fn()
    const doc: Row = {
      _id: "ro_1",
      tableId: "table_1",
      score: null,
    }

    const fn = buildMapFunction(view)
    fn(doc, emit)

    expect(emit).not.toHaveBeenCalled()
  })

  it("emits multiple keys for multi group fields", () => {
    const view = buildView({ groupBy: "labels", groupByMulti: true })
    const emitSpy: Array<[any, any]> = []
    const emit = (key: any, value?: any) => emitSpy.push([key, value])
    const doc: Row = {
      _id: "ro_1",
      tableId: "table_1",
      labels: ["alpha", "beta"],
      score: 3,
    }

    const fn = buildMapFunction(view)
    fn(doc, emit)

    expect(emitSpy).toEqual([
      ["alpha", 3],
      ["beta", 3],
    ])
  })
})

