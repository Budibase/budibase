import { context, features } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"
import { FeatureFlag, FieldType, type Row } from "@budibase/types"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("project table import schema", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })
  afterAll(() => config.end())

  it("does not adopt unselected input when another save adds a column", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      async () => {
        const table = await config.api.table.save(basicTable())
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
              doc => doc.type === "row" && doc.name === "Imported row"
            )
            if (row && !importedRowId) {
              expect(row).toMatchObject({ description: "Selected value" })
              expect(row).not.toHaveProperty("later")
              importedRowId = row._id
              importStarted()
              await pending
            }
            return originalBulkDocs.call(this, docs)
          })

        const saving = config.api.table.save({
          ...table,
          rows: [
            {
              name: "Imported row",
              description: "Selected value",
              later: "Unselected input",
            },
          ],
        })
        try {
          await helpers.withTimeout(5000, () => ready)
          await helpers.withTimeout(5000, async () => {
            const current = await config.api.table.get(table._id!)
            await config.api.table.save({
              ...current,
              schema: {
                ...current.schema,
                later: { name: "later", type: FieldType.STRING },
              },
            })
          })
        } finally {
          releaseImport()
          await saving.finally(() => bulkDocs.mockRestore())
        }

        expect((await saving).schema.later).toBeDefined()
        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const persisted = await context
            .getWorkspaceDB()
            .get<Row>(importedRowId!)
          expect(persisted.name).toBe("Imported row")
          expect(persisted.description).toBe("Selected value")
          expect(persisted).not.toHaveProperty("later")
        })
      }
    )
  })
})
