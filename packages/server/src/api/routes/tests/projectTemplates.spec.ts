import { features, objectStore } from "@budibase/backend-core"
import { Header } from "@budibase/shared-core"
import {
  FeatureFlag,
  FieldType,
  RelationshipType,
  type ImportProjectTemplateResponse,
  type RowAttachment,
} from "@budibase/types"
import nock from "nock"
import { Readable } from "stream"
import { buffer } from "stream/consumers"
import { ObjectStoreBuckets } from "../../../constants"
import { withEnv } from "../../../environment"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import {
  catalogueVersion,
  mockCatalogue,
  repositoryUrl,
  templateEntry,
} from "../../../sdk/workspace/projects/tests/templateFixtures"

describe("Project template catalogue API", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => config.end())

  const withProjectTemplatesEnabled = async <T>(f: () => Promise<T>) =>
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      {
        [FeatureFlag.PROJECTS]: true,
        [FeatureFlag.TEMPLATES]: true,
      },
      f
    )

  it.each([
    {
      name: "both feature flags are disabled",
      projects: false,
      templates: false,
    },
    { name: "only Projects is enabled", projects: true, templates: false },
    { name: "only Templates is enabled", projects: false, templates: true },
  ])("is unavailable when $name", async ({ projects, templates }) => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      {
        [FeatureFlag.PROJECTS]: projects,
        [FeatureFlag.TEMPLATES]: templates,
      },
      async () => {
        await config.api.project.fetchTemplates({ status: 404 })
        await config.api.project.importTemplate({
          templateKey: "project/support",
          expectations: { status: 404 },
        })
      }
    )
  })

  it("returns the curated catalogue when enabled", async () => {
    const template = templateEntry()
    mockCatalogue()

    const response = await withProjectTemplatesEnabled(
      async () =>
        await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
          config.api.project.fetchTemplates()
        )
    )

    expect(response.catalogueVersion).toBe(catalogueVersion)
    expect(response.templates).toEqual([
      expect.objectContaining({
        key: template.key,
        name: template.name,
        packageVersion: template.artifact.packageVersion,
      }),
    ])
  })

  it("imports an approved artifact through the Project importer", async () => {
    await withProjectTemplatesEnabled(async () => {
      const { project } = await config.api.project.create({ name: "Support" })
      const artifact = await config.api.project.export(project._id)
      const template = templateEntry({ artifact })
      mockCatalogue([template])
      nock(repositoryUrl)
        .get("/artifacts/project/support/1.0.0/project.tar.gz")
        .reply(200, artifact, {
          "Content-Length": artifact.length.toString(),
        })

      const response = await withEnv(
        { PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl },
        () =>
          config.api.project.importTemplate({
            templateKey: template.key,
          })
      )

      expect(response.template).toEqual({
        key: template.key,
        version: template.version,
        packageVersion: template.artifact.packageVersion,
        catalogueVersion,
      })
      expect(response.project.name).toBe(project.name)
      expect(response.project._id).not.toBe(project._id)
      expect(response.resources.project).toEqual([response.project._id])
    })
  })

  const exportSampleDataTemplate = async () => {
    const { project } = await config.api.project.create({ name: "Support" })
    const categories = await config.api.table.save(
      basicTable(undefined, { name: "Categories", projectIds: [project._id] })
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
        },
      })
    )
    const attachmentContent = Buffer.from("Sample task instructions")
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
    const task = await config.api.row.save(tasks._id!, {
      name: "First task",
      category: [category._id!],
      attachment,
    })
    const artifact = await config.api.project.export(project._id, {
      includeRows: true,
    })
    return {
      project,
      categories,
      tasks,
      task,
      attachment,
      attachmentContent,
      artifact,
      template: templateEntry({ artifact }),
    }
  }

  const importApprovedTemplate = async ({
    artifact,
    template,
  }: {
    artifact: Buffer
    template: ReturnType<typeof templateEntry>
  }) => {
    mockCatalogue([template])
    nock(repositoryUrl)
      .get(
        `/artifacts/project/${template.slug}/${template.version}/project.tar.gz`
      )
      .reply(200, artifact)
    return await withEnv(
      { PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl },
      () => config.api.project.importTemplate({ templateKey: template.key })
    )
  }

  const readImportedData = async (copy: ImportProjectTemplateResponse) => {
    const tables = (await config.api.table.fetch()).filter(table =>
      copy.resources.table?.includes(table._id!)
    )
    const tasks = tables.find(table => table.name === "Tasks")!
    const categories = tables.find(table => table.name === "Categories")!
    const rows = await config.api.row.fetch(tasks._id!)
    const categoryRows = await config.api.row.fetch(categories._id!)
    const attachment: RowAttachment = rows[0].attachment
    return { tasks, categories, rows, categoryRows, attachment }
  }

  it("imports related sample rows and attachment bytes into another workspace", async () => {
    await withProjectTemplatesEnabled(async () => {
      const source = await exportSampleDataTemplate()
      const destination = await config.api.workspace.create({
        name: "Destination",
      })

      await config.withHeaders(
        { [Header.WORKSPACE_ID]: destination.appId },
        async () => {
          const response = await importApprovedTemplate(source)
          const imported = await readImportedData(response)
          const { stream } = await objectStore.getReadStream(
            ObjectStoreBuckets.APPS,
            imported.attachment.key!
          )

          expect(response.dataImport).toEqual({
            tables: 2,
            rows: 2,
            relationships: 1,
            attachments: 1,
          })
          expect(imported.rows).toEqual([
            expect.objectContaining({
              name: "First task",
              tableId: imported.tasks._id,
              category: [
                expect.objectContaining({ _id: imported.categoryRows[0]._id }),
              ],
            }),
          ])
          expect(imported.categoryRows).toEqual([
            expect.objectContaining({
              name: "Open",
              tasks: [expect.objectContaining({ _id: imported.rows[0]._id })],
            }),
          ])
          expect(await buffer(stream)).toEqual(source.attachmentContent)
          expect(imported.attachment.key).not.toBe(source.attachment.key)
        }
      )
      expect(await config.api.row.fetch(source.tasks._id!)).toEqual([
        expect.objectContaining({
          _id: source.task._id,
          name: "First task",
          attachment: expect.objectContaining(source.attachment),
        }),
      ])
    })
  })

  it("keeps repeated imports independent and preserves existing destination records", async () => {
    await withProjectTemplatesEnabled(async () => {
      const source = await exportSampleDataTemplate()
      const destination = await config.api.workspace.create({
        name: "Destination",
      })

      await config.withHeaders(
        { [Header.WORKSPACE_ID]: destination.appId },
        async () => {
          const { project: existingProject } = await config.api.project.create({
            name: "Existing",
          })
          const existingTable = await config.api.table.save(
            basicTable(undefined, {
              name: "Existing records",
              projectIds: [existingProject._id],
            })
          )
          const existingRow = await config.api.row.save(existingTable._id!, {
            name: "Keep this record",
          })
          const copies = [
            await importApprovedTemplate(source),
            await importApprovedTemplate(source),
          ]
          const importedCopies = await Promise.all(copies.map(readImportedData))

          expect(
            new Set([
              source.project._id,
              ...copies.map(copy => copy.project._id),
            ]).size
          ).toBe(3)
          expect(
            new Set([
              source.tasks._id,
              ...importedCopies.map(copy => copy.tasks._id),
            ]).size
          ).toBe(3)
          expect(
            new Set([
              source.categories._id,
              ...importedCopies.map(copy => copy.categories._id),
            ]).size
          ).toBe(3)
          expect(
            new Set([
              source.task._id,
              ...importedCopies.map(copy => copy.rows[0]._id),
            ]).size
          ).toBe(3)
          expect(
            new Set([
              source.attachment.key,
              ...importedCopies.map(copy => copy.attachment.key),
            ]).size
          ).toBe(3)
          expect(
            (await config.api.project.fetch()).projects
              .map(project => project._id)
              .sort()
          ).toEqual(
            [
              existingProject._id,
              ...copies.map(copy => copy.project._id),
            ].sort()
          )
          expect(await config.api.row.fetch(existingTable._id!)).toEqual([
            expect.objectContaining({
              _id: existingRow._id,
              name: "Keep this record",
            }),
          ])
        }
      )
    })
  })

  it("rejects template imports into production workspaces", async () => {
    await withProjectTemplatesEnabled(async () => {
      await config.publish()
      await config.withHeaders(
        { [Header.WORKSPACE_ID]: config.getProdWorkspaceId() },
        async () => {
          await config.api.project.importTemplate({
            templateKey: "project/support",
            expectations: {
              status: 400,
              body: {
                message: "Only apps in development support this endpoint",
              },
            },
          })
          expect((await config.api.project.fetch()).projects).toEqual([])
        }
      )
    })
  })

  it("rejects an authenticated user without builder access to the destination", async () => {
    await withProjectTemplatesEnabled(async () => {
      const headers = await config.roleHeaders({
        builder: false,
        prodApp: false,
      })
      await config.withHeaders(headers, () =>
        config.api.project.importTemplate({
          templateKey: "project/support",
          expectations: { status: 403 },
        })
      )
      expect((await config.api.project.fetch()).projects).toEqual([])
    })
  })

  it("does not import an artifact with the wrong checksum", async () => {
    await withProjectTemplatesEnabled(async () => {
      const artifact = Buffer.from("artifact")
      const template = templateEntry({ artifact, sha256: "0".repeat(64) })
      mockCatalogue([template])
      nock(repositoryUrl)
        .get("/artifacts/project/support/1.0.0/project.tar.gz")
        .reply(200, artifact)

      await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
        config.api.project.importTemplate({
          templateKey: template.key,
          expectations: {
            status: 502,
            body: {
              message: "Project template artifact checksum does not match.",
            },
          },
        })
      )

      const { projects } = await config.api.project.fetch()
      expect(projects).toHaveLength(0)
    })
  })

  it("rejects a withdrawn template before downloading", async () => {
    await withProjectTemplatesEnabled(async () => {
      const template = templateEntry({ status: "withdrawn" })
      mockCatalogue([template])

      await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
        config.api.project.importTemplate({
          templateKey: template.key,
          expectations: {
            status: 404,
            body: { message: `Project template '${template.key}' not found.` },
          },
        })
      )
    })
  })

  it("rejects an unknown template key before downloading", async () => {
    await withProjectTemplatesEnabled(async () => {
      mockCatalogue([])

      await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
        config.api.project.importTemplate({
          templateKey: "project/missing",
          expectations: {
            status: 404,
            body: { message: "Project template 'project/missing' not found." },
          },
        })
      )
    })
  })

  it("rejects malformed keys before reading the catalogue", async () => {
    await withProjectTemplatesEnabled(() =>
      config.api.project.importTemplate({
        templateKey: "../project/support",
        expectations: { status: 400 },
      })
    )
  })

  it("leaves the workspace unchanged when package validation fails", async () => {
    await withProjectTemplatesEnabled(async () => {
      const artifact = Buffer.from("not a Project package")
      const template = templateEntry({ artifact })
      mockCatalogue([template])
      nock(repositoryUrl)
        .get("/artifacts/project/support/1.0.0/project.tar.gz")
        .reply(200, artifact)

      await withEnv({ PROJECT_TEMPLATE_REPOSITORY_URL: repositoryUrl }, () =>
        config.api.project.importTemplate({
          templateKey: template.key,
          expectations: {
            status: 400,
          },
        })
      )

      const { projects } = await config.api.project.fetch()
      expect(projects).toHaveLength(0)
    })
  })
})
