import { context, events, features } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"
import {
  FeatureFlag,
  FieldType,
  JsonFieldSubType,
  Row,
  Table,
} from "@budibase/types"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import { withPublishLock } from "../../controllers/deploy"

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

  const importRows = async (
    route: "save" | "bulk",
    table: Table,
    rows: Row[]
  ) => {
    if (route === "save") {
      return await config.api.table.save({ ...table, rows })
    }
    return await config.api.table.import(table._id!, { rows })
  }

  const withProjectsEnabled = async (fn: () => Promise<void>) =>
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      fn
    )

  const withPausedImport = async (
    route: "save" | "bulk",
    table: Table,
    whilePaused: () => Promise<void>
  ) => {
    let importStarted!: () => void
    let releaseImport!: () => void
    const ready = new Promise<void>(resolve => (importStarted = resolve))
    const pending = new Promise<void>(resolve => (releaseImport = resolve))
    const originalBulkDocs = DatabaseImpl.prototype.bulkDocs
    let importedRowId: string | undefined
    const bulkDocs = jest
      .spyOn(DatabaseImpl.prototype, "bulkDocs")
      .mockImplementation(async function (this: DatabaseImpl, docs) {
        const row = docs.find(
          doc =>
            doc.type === "row" &&
            doc.tableId === table._id &&
            doc.name === "Imported"
        )
        if (row && !importedRowId) {
          importedRowId = row._id
          importStarted()
          await pending
        }
        return originalBulkDocs.call(this, docs)
      })
    const importing = importRows(route, table, [
      { name: "Imported", status: "Review" },
    ])
    try {
      await helpers.withTimeout(5000, () => ready)
      await helpers.withTimeout(5000, whilePaused)
    } finally {
      releaseImport()
      await importing.finally(() => bulkDocs.mockRestore())
    }
    return importedRowId!
  }

  it.each(["save", "bulk"] as const)(
    "%s persists imported single-select and multi-select options without duplicates",
    async route => {
      const table = await createTable()
      await importRows(route, table, [
        { name: "First", status: "Review", tags: ["Existing", "New"] },
        { name: "Second", status: "Review", tags: ["New"] },
      ])

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
    }
  )

  it.each(["save", "bulk"] as const)(
    "%s preserves concurrent project and schema edits when adding imported options",
    async route => {
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
          await importRows(route, table, [
            { name: "Imported", status: "Review" },
          ])

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
    }
  )

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

  describe.each(["save", "bulk"] as const)("%s import schema races", route => {
    it.each(["rename", "delete"] as const)(
      "reconciles imported rows after a concurrent column %s",
      async change => {
        await withProjectsEnabled(async () => {
          const table = await createTable()
          const importedRowId = await withPausedImport(
            route,
            table,
            async () => {
              const current = await config.api.table.get(table._id!)
              const { status, ...schema } = current.schema
              if (status.type !== FieldType.OPTIONS) {
                throw new Error("expected options field")
              }
              await config.api.table.save({
                ...current,
                ...(change === "rename"
                  ? { _rename: { old: "status", updated: "state" } }
                  : {}),
                schema: {
                  ...schema,
                  ...(change === "rename"
                    ? {
                        state: {
                          ...status,
                          name: "State",
                          constraints: { inclusion: ["Concurrent"] },
                        },
                      }
                    : {}),
                },
              })
            }
          )

          const savedTable = await config.api.table.get(table._id!)
          expect(savedTable.schema.status).toBeUndefined()
          if (change === "rename") {
            expect(savedTable.schema.state.constraints?.inclusion).toEqual([
              "Concurrent",
              "Review",
            ])
          }
          await config.doInContext(config.getDevWorkspaceId(), async () => {
            // Read the stored document because API responses hide deleted columns.
            const row = await context.getWorkspaceDB().get<Row>(importedRowId)
            expect(row.status).toBeUndefined()
            expect(row.state).toBe(change === "rename" ? "Review" : undefined)
          })
        })
      }
    )
  })

  it.each(["name", "_id"])(
    "updates matching rows when bulk import identifies them by %s",
    async identifierField => {
      const table = await createTable()
      const original = await config.api.row.save(table._id!, {
        name: "Existing",
        status: "Done",
        description: "Original description",
      })
      await config.api.table.import(table._id!, {
        identifierFields: [identifierField],
        rows: [
          {
            ...(identifierField === "_id" ? { _id: original._id } : {}),
            name: "Existing",
            status: "Review",
            description: "Updated",
          },
          { name: "New", status: "Review" },
        ],
      })

      const { rows } = await config.api.row.search(table._id!)
      expect(rows).toHaveLength(2)
      expect(rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: original._id,
            name: "Existing",
            status: "Review",
            description: "Updated",
          }),
          expect.objectContaining({ name: "New", status: "Review" }),
        ])
      )
      expect(
        (await config.api.table.get(table._id!)).schema.status.constraints
          ?.inclusion
      ).toEqual(["Done", "Review"])
    }
  )

  it("rejects nonempty bulk imports while publishing holds its lock and allows empty imports", async () => {
    await withProjectsEnabled(async () => {
      const table = await createTable()
      await config.doInContext(config.getDevWorkspaceId(), () =>
        withPublishLock(async () => {
          await config.api.table.import(
            table._id!,
            { rows: [{ name: "Should not import", status: "Review" }] },
            { status: 429 }
          )
          await config.api.table.import(table._id!, { rows: [] })
        })
      )
      expect(await config.api.row.fetch(table._id!)).toEqual([])
      expect((await config.api.table.get(table._id!))._rev).toBe(table._rev)
    })
  })

  it("blocks publishing until a bulk import reconciles a concurrent rename", async () => {
    await withProjectsEnabled(async () => {
      const table = await createTable()
      const importedRowId = await withPausedImport("bulk", table, async () => {
        const current = await config.api.table.get(table._id!)
        const { status, ...schema } = current.schema
        await config.api.table.save({
          ...current,
          _rename: { old: "status", updated: "state" },
          schema: { ...schema, state: { ...status, name: "State" } },
        })
        await config.api.workspace.publish(config.getDevWorkspaceId(), {
          status: 429,
        })
        expect(
          (await config.api.table.get(table._id!)).pendingColumnRenames
        ).toHaveLength(1)
      })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const row = await context.getWorkspaceDB().get<Row>(importedRowId)
        expect(row.state).toBe("Review")
        expect(row.status).toBeUndefined()
      })
      expect(
        (await config.api.table.get(table._id!)).schema.state.constraints
          ?.inclusion
      ).toEqual(["Done", "Review"])
      await config.api.workspace.publish(config.getDevWorkspaceId())
      expect(
        (await config.api.table.get(table._id!)).pendingColumnRenames
      ).toEqual([])
    })
  })
})
