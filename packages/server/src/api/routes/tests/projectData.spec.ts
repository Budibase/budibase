import { context, db, features, objectStore } from "@budibase/backend-core"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import { mocks } from "@budibase/backend-core/tests"
import { quotas } from "@budibase/pro"
import { Header } from "@budibase/shared-core"
import {
  AutoFieldSubType,
  FeatureFlag,
  FieldType,
  QuotaUsageType,
  RelationshipType,
  StaticQuotaName,
  type ImportProjectResponse,
  type Row,
  type RowAttachment,
} from "@budibase/types"
import { Readable } from "stream"
import { buffer } from "stream/consumers"
import cloneDeep from "lodash/cloneDeep"
import { ObjectStoreBuckets } from "../../../constants"
import BudibaseEmitter from "../../../events/BudibaseEmitter"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("Project data export and import", () => {
  const config = new TestConfiguration()
  const attachmentContent = Buffer.from("Instructions for the sample task")

  const withProjectsEnabled = async <T>(task: () => Promise<T>) =>
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      task
    )

  beforeEach(async () => {
    mocks.licenses.useUnlimited()
    await config.newTenant()
  })

  afterEach(() => {
    mocks.licenses.useUnlimited()
  })

  afterAll(() => config.end())

  it("rejects a string data-export toggle", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({ name: "Tasks" })
      await config
        .request!.post(`/api/projects/${project._id}/export`)
        .set(config.defaultHeaders())
        .send({ includeRows: "false" })
        .expect(400)
    })
  })

  const createDataProject = async () => {
    const { project } = await config.api.project.create({ name: "Tasks" })
    const { project: sharedProject } = await config.api.project.create({
      name: "Shared categories",
    })
    const categories = await config.api.table.save(
      basicTable(undefined, {
        name: "Categories",
        projectIds: [project._id, sharedProject._id],
      })
    )
    const tasks = await config.api.table.save(
      basicTable(undefined, {
        name: "Tasks",
        projectIds: [project._id],
        schema: {
          category: {
            name: "category",
            type: FieldType.LINK,
            tableId: categories._id!,
            fieldName: "tasks",
            relationshipType: RelationshipType.MANY_TO_MANY,
          },
          attachment: {
            name: "attachment",
            type: FieldType.ATTACHMENT_SINGLE,
          },
          gallery: { name: "gallery", type: FieldType.ATTACHMENTS },
          autoId: {
            name: "autoId",
            type: FieldType.NUMBER,
            subtype: AutoFieldSubType.AUTO_ID,
            autocolumn: true,
          },
        },
      })
    )

    const attachment: RowAttachment = {
      key: `${config.getProdWorkspaceId()}/attachments/instructions.txt`,
      name: "instructions.txt",
      extension: "txt",
      size: attachmentContent.length,
    }
    await objectStore.streamUpload({
      bucket: ObjectStoreBuckets.APPS,
      filename: attachment.key!,
      stream: Readable.from(attachmentContent),
      type: "text/plain",
    })
    const category = await config.api.row.save(categories._id!, {
      name: "Open",
    })
    await config.api.row.save(categories._id!, { name: "Closed" })
    const description = `Sample content referencing ${tasks._id}`
    const task = await config.api.row.save(tasks._id!, {
      name: "First task",
      description,
      category: [category._id!],
      attachment,
      gallery: [attachment],
    })
    await config.doInContext(undefined, async () => {
      const db = context.getWorkspaceDB()
      const stored = await db.get<Row>(task._id!)
      await db.put({ ...stored, autoId: 42 })
    })

    const excludedTable = await config.api.table.save(
      basicTable(undefined, { name: "Unrelated records" })
    )
    await config.api.row.save(excludedTable._id!, { name: "Private record" })
    await objectStore.streamUpload({
      bucket: ObjectStoreBuckets.APPS,
      filename: `${config.getProdWorkspaceId()}/attachments/unreferenced.txt`,
      stream: Readable.from("Unreferenced attachment"),
      type: "text/plain",
    })

    return {
      project,
      tasks,
      task,
      categories,
      category,
      attachment,
      description,
    }
  }

  const readImportedData = async (imported: ImportProjectResponse) => {
    const tables = (await config.api.table.fetch()).filter(table =>
      imported.resources.table?.includes(table._id!)
    )
    const tasks = tables.find(table => table.name === "Tasks")!
    const categories = tables.find(table => table.name === "Categories")!
    const rows = await config.api.row.fetch(tasks._id!)
    const categoryRows = await config.api.row.fetch(categories._id!)
    return { tasks, categories, rows, categoryRows }
  }

  it("leaves tables empty when data is not requested", async () => {
    await withProjectsEnabled(async () => {
      const source = await createDataProject()
      const archive = await config.api.project.export(source.project._id)
      const imported = await config.api.project.import(archive)
      const data = await readImportedData(imported)

      expect(data.rows).toEqual([])
      expect(data.categoryRows).toEqual([])
      expect(imported.resources.table).toHaveLength(2)
      expect(await config.api.row.fetch(source.tasks._id!)).toEqual([
        expect.objectContaining({ _id: source.task._id, autoId: 42 }),
      ])
    })
  })

  it.each([undefined, "example-password"])(
    "imports related rows and attachments twice independently (password: %s)",
    async encryptPassword => {
      await withProjectsEnabled(async () => {
        const source = await createDataProject()
        const archive = await config.api.project.export(source.project._id, {
          includeRows: true,
          encryptPassword,
        })
        const destination = await config.api.workspace.create({
          name: "Destination",
        })
        await config.withHeaders(
          { [Header.WORKSPACE_ID]: destination.appId },
          async () => {
            const existing = await config.api.table.save(
              basicTable(undefined, { name: "Existing table" })
            )
            const existingRow = await config.api.row.save(existing._id!, {
              name: "Keep me",
            })
            const usageBefore = await config.doInContext(
              destination.appId,
              () =>
                quotas.getCurrentUsageValues(
                  QuotaUsageType.STATIC,
                  StaticQuotaName.ROWS
                )
            )
            const emitRow = jest.spyOn(BudibaseEmitter.prototype, "emitRow")
            try {
              const imports = []
              for (let i = 0; i < 2; i++) {
                const imported = await config.api.project.import(
                  archive,
                  encryptPassword ? { encryptPassword } : undefined
                )
                const data = await readImportedData(imported)
                const openCategory = data.categoryRows.find(
                  row => row.name === "Open"
                )!
                const attachment: RowAttachment = data.rows[0].attachment
                const { stream } = await objectStore.getReadStream(
                  ObjectStoreBuckets.APPS,
                  attachment.key!
                )

                expect(imported.dataImport).toEqual({
                  tables: 2,
                  rows: 3,
                  relationships: 1,
                  attachments: 1,
                })
                expect(data.rows).toEqual([
                  expect.objectContaining({
                    name: "First task",
                    description: source.description,
                    autoId: 42,
                    tableId: data.tasks._id,
                    category: [
                      expect.objectContaining({ _id: openCategory._id }),
                    ],
                    attachment: expect.objectContaining({
                      name: source.attachment.name,
                      size: attachmentContent.length,
                    }),
                    gallery: [expect.objectContaining({ key: attachment.key })],
                  }),
                ])
                expect(data.categoryRows.map(row => row.name).sort()).toEqual([
                  "Closed",
                  "Open",
                ])
                expect(openCategory.tasks).toEqual([
                  expect.objectContaining({ _id: data.rows[0]._id }),
                ])
                expect(attachment.key).not.toBe(source.attachment.key)
                expect(await buffer(stream)).toEqual(attachmentContent)
                imports.push(data)
              }

              expect(
                new Set([
                  source.tasks._id,
                  imports[0].tasks._id,
                  imports[1].tasks._id,
                ]).size
              ).toBe(3)
              expect(
                new Set([
                  source.task._id,
                  imports[0].rows[0]._id,
                  imports[1].rows[0]._id,
                ]).size
              ).toBe(3)
              expect(imports[0].rows[0].attachment.key).not.toBe(
                imports[1].rows[0].attachment.key
              )
              expect(await config.api.row.fetch(existing._id!)).toEqual([
                expect.objectContaining({
                  _id: existingRow._id,
                  name: "Keep me",
                }),
              ])
              expect(emitRow).not.toHaveBeenCalled()
              const usageAfter = await config.doInContext(
                destination.appId,
                () =>
                  quotas.getCurrentUsageValues(
                    QuotaUsageType.STATIC,
                    StaticQuotaName.ROWS
                  )
              )
              expect(usageAfter.total - usageBefore.total).toBe(6)
              expect(usageAfter.app! - usageBefore.app!).toBe(6)
            } finally {
              emitRow.mockRestore()
            }
          }
        )
      })
    }
  )

  it("allocates the next Auto ID above imported values", async () => {
    await withProjectsEnabled(async () => {
      const source = await createDataProject()
      const archive = await config.api.project.export(source.project._id, {
        includeRows: true,
      })
      const imported = await config.api.project.import(archive)
      const data = await readImportedData(imported)
      const next = await config.api.row.save(data.tasks._id!, {
        name: "Next task",
      })

      expect(next.autoId).toBe(43)
    })
  })

  const createDestination = async () => {
    const destination = await config.api.workspace.create({
      name: "Existing destination",
    })
    await config.withHeaders(
      { [Header.WORKSPACE_ID]: destination.appId },
      async () => {
        const { project } = await config.api.project.create({
          name: "Existing project",
        })
        const table = await config.api.table.save(
          basicTable(undefined, {
            name: "Existing table",
            projectIds: [project._id],
          })
        )
        await config.api.row.save(table._id!, { name: "Keep this record" })
        await objectStore.streamUpload({
          bucket: ObjectStoreBuckets.APPS,
          filename: `${db.getProdWorkspaceID(destination.appId)}/attachments/existing.txt`,
          stream: Readable.from("Keep this attachment"),
          type: "text/plain",
        })
      }
    )
    return destination
  }

  const snapshotWorkspace = async (workspaceId: string) =>
    await config.doInContext(workspaceId, async () => ({
      documents: (
        await context.getWorkspaceDB().allDocs({ include_docs: true })
      ).rows.map(({ doc }) => doc),
      attachmentKeys: Object.keys(
        await objectStore.getAllFiles(
          ObjectStoreBuckets.APPS,
          `${db.getProdWorkspaceID(workspaceId)}/attachments/`
        )
      ).sort(),
      rowUsage: await quotas.getCurrentUsageValues(
        QuotaUsageType.STATIC,
        StaticQuotaName.ROWS
      ),
    }))

  it("rolls back partial row writes and uploaded attachments without changing existing data", async () => {
    await withProjectsEnabled(async () => {
      const source = await createDataProject()
      const archive = await config.api.project.export(source.project._id, {
        includeRows: true,
      })
      const destination = await createDestination()
      const before = await snapshotWorkspace(destination.appId)
      const originalBulkDocs = DatabaseImpl.prototype.bulkDocs
      const bulkDocs = jest
        .spyOn(DatabaseImpl.prototype, "bulkDocs")
        .mockImplementation(async function (this: DatabaseImpl, docs) {
          if (
            context.getWorkspaceId() === destination.appId &&
            docs.some(doc => doc._id?.startsWith("ro_") && !doc._deleted)
          ) {
            const saved = await this.put(docs[0])
            return [
              { id: saved.id, rev: saved.rev },
              ...docs.slice(1).map(doc => ({
                id: doc._id!,
                error: "conflict",
                reason: "import failed",
              })),
            ]
          }
          return await originalBulkDocs.call(this, docs)
        })

      try {
        await config.withHeaders(
          { [Header.WORKSPACE_ID]: destination.appId },
          async () => {
            await config.api.project.import(archive, undefined, {
              status: 400,
              body: {
                message: expect.stringContaining(
                  "Project import failed while saving"
                ),
              },
            })
          }
        )
      } finally {
        bulkDocs.mockRestore()
      }

      expect(await snapshotWorkspace(destination.appId)).toEqual(before)
    })
  })

  it("checks the total row quota across tables before importing any resources or attachments", async () => {
    await withProjectsEnabled(async () => {
      const source = await createDataProject()
      const archive = await config.api.project.export(source.project._id, {
        includeRows: true,
      })
      const destination = await createDestination()
      const before = await snapshotWorkspace(destination.appId)
      const license = cloneDeep(mocks.licenses.useUnlimited())
      license.quotas.usage.static.rows.value = before.rowUsage.total + 2
      license.quotas.usage.static.rows.triggers = []
      mocks.licenses.useLicense(license)

      await config.withHeaders(
        { [Header.WORKSPACE_ID]: destination.appId },
        async () => {
          await config.api.project.import(archive, undefined, {
            status: 400,
            body: { message: "Usage limit exceeded: 'rows'" },
          })
        }
      )

      expect(await snapshotWorkspace(destination.appId)).toEqual(before)
    })
  })
})
