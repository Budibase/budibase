import { context, events, features } from "@budibase/backend-core"
import {
  FeatureFlag,
  FieldType,
  JsonFieldSubType,
  Table,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("internal table row imports", () => {
  const config = new TestConfiguration()

  beforeEach(async () => config.newTenant())
  afterAll(() => config.end())

  const createTable = async () => {
    const definition = basicTable()
    return await config.api.table.save({
      ...definition,
      schema: {
        ...definition.schema,
        status: {
          name: "Status",
          type: FieldType.OPTIONS,
          constraints: { inclusion: ["Done"] },
        },
        tags: {
          name: "Tags",
          type: FieldType.ARRAY,
          constraints: {
            type: JsonFieldSubType.ARRAY,
            inclusion: ["Existing"],
          },
        },
      },
    })
  }

  it("persists imported single-select and multi-select options without duplicates", async () => {
    const table = await createTable()
    await config.api.table.import(table._id!, {
      rows: [
        { name: "First", status: "Review", tags: ["Existing", "New"] },
        { name: "Second", status: "Review", tags: ["New"] },
      ],
    })

    const savedTable = await config.api.table.get(table._id!)
    const { rows } = await config.api.row.search(table._id!)
    expect(savedTable.schema.status.constraints?.inclusion).toEqual([
      "Done",
      "Review",
    ])
    expect(savedTable.schema.tags.constraints?.inclusion).toEqual([
      "Existing",
      "New",
    ])
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "First",
          status: "Review",
          tags: ["Existing", "New"],
        }),
        expect.objectContaining({
          name: "Second",
          status: "Review",
          tags: ["New"],
        }),
      ])
    )
  })

  it("preserves concurrent project and schema edits when adding imported options", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      async () => {
        const table = await createTable()
        const { project } = await config.api.project.create({
          name: "Import project",
        })
        jest.mocked(events.rows.imported).mockImplementationOnce(async () => {
          const db = context.getWorkspaceDB()
          const currentTable = await db.get<Table>(table._id!)
          await db.put({
            ...currentTable,
            name: "Renamed during import",
            projectIds: [project._id],
            schema: {
              ...currentTable.schema,
              status: {
                ...currentTable.schema.status,
                constraints: { inclusion: ["Concurrent"] },
              },
            },
          })
        })
        await config.api.table.import(table._id!, {
          rows: [{ name: "Imported", status: "Review" }],
        })

        const savedTable = await config.api.table.get(table._id!)
        const { rows } = await config.api.row.search(table._id!)
        expect(savedTable).toEqual(
          expect.objectContaining({
            name: "Renamed during import",
            projectIds: [project._id],
          })
        )
        expect(savedTable.schema.status.constraints?.inclusion).toEqual([
          "Concurrent",
          "Review",
        ])
        expect(rows).toEqual([
          expect.objectContaining({ name: "Imported", status: "Review" }),
        ])
      }
    )
  })

  it("does not rewrite the table when an import adds no options", async () => {
    const table = await createTable()
    await config.api.table.import(table._id!, {
      rows: [{ name: "Existing options", status: "Done", tags: ["Existing"] }],
    })

    const savedTable = await config.api.table.get(table._id!)
    expect(savedTable._rev).toEqual(table._rev)
    const { rows } = await config.api.row.search(table._id!)
    expect(rows).toEqual([
      expect.objectContaining({
        name: "Existing options",
        status: "Done",
        tags: ["Existing"],
      }),
    ])
  })
})
