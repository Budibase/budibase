import { context, db, features, objectStore } from "@budibase/backend-core"
import {
  FeatureFlag,
  SourceName,
  type ImportProjectRequest,
  type ImportProjectResponse,
  type Query,
} from "@budibase/types"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
} from "../../../tests/utilities/structures"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual<typeof import("@budibase/backend-core")>(
    "@budibase/backend-core"
  )
  return {
    ...actual,
    objectStore: {
      ...actual.objectStore,
      upload: jest.fn(actual.objectStore.upload),
    },
  }
})

const OPENAPI_SCHEMA = JSON.stringify({
  openapi: "3.0.0",
  info: { title: "Example API", version: "1.0.0" },
  servers: [{ url: "https://example.com" }],
  paths: {
    "/items": {
      get: {
        operationId: "listItems",
        responses: { "200": { description: "Success" } },
      },
    },
  },
})

describe("Project custom REST templates", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterEach(() => jest.restoreAllMocks())
  afterAll(() => config.end())

  const withProjectsEnabled = async <T>(task: () => Promise<T>) =>
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      task
    )

  const createTemplate = async ({
    name = "Example API",
    data = OPENAPI_SCHEMA,
  }: { name?: string; data?: string } = {}) =>
    await config.doInContext(config.getDevWorkspaceId(), () =>
      sdk.restTemplates.create({
        name,
        description: "An imported API",
        fileExtension: "json",
        data,
        operationsCount: 1,
      })
    )

  const createPackage = async (options?: ImportProjectRequest) => {
    const template = await createTemplate()
    const { project } = await config.api.project.create({ name: "API project" })
    const datasource = await config.api.datasource.create({
      ...basicDatasource().datasource,
      source: SourceName.REST,
      config: {},
      restTemplateId: template.id,
      projectIds: [project._id],
    })
    await config.api.query.save({
      ...basicQuery(datasource._id!),
      projectIds: [project._id],
      restTemplateMetadata: {
        restTemplateId: template.id,
        operationId: "listItems",
      },
    })
    return {
      templateId: template.id,
      file: await config.api.project.export(project._id, options),
    }
  }

  const expectImportedEndpoints = async (imported: ImportProjectResponse) => {
    const datasource = await config.api.datasource.get(
      imported.resources.datasource![0]
    )
    const query = await config.doInContext(config.getDevWorkspaceId(), () =>
      context.getWorkspaceDB().get<Query>(imported.resources.query![0])
    )
    const response = await config
      .request!.post("/api/queries/import/info")
      .set(config.defaultHeaders())
      .send({ restTemplateId: datasource.restTemplateId })
      .expect(200)
    expect(query.restTemplateMetadata?.restTemplateId).toBe(
      datasource.restTemplateId
    )
    expect(response.body.endpoints).toEqual([
      expect.objectContaining({ path: "/items", operationId: "listItems" }),
    ])
    return datasource
  }

  const fetchTemplates = async () =>
    await config.doInContext(config.getDevWorkspaceId(), () =>
      sdk.restTemplates.fetch()
    )

  it("reuses an existing template ID without uploading the spec", async () => {
    await withProjectsEnabled(async () => {
      const { file, templateId } = await createPackage()
      const upload = jest.mocked(objectStore.upload).mockClear()
      const imported = await config.api.project.import(file)
      const datasource = await expectImportedEndpoints(imported)
      expect(datasource.restTemplateId).toBe(templateId)
      expect(await fetchTemplates()).toHaveLength(1)
      expect(upload).not.toHaveBeenCalled()
    })
  })

  it.each([
    { description: "unencrypted", options: undefined },
    {
      description: "encrypted",
      options: { encryptPassword: "project-password" },
    },
  ])(
    "uploads missing specs in another workspace ($description)",
    async ({ options }) => {
      await withProjectsEnabled(async () => {
        const { file } = await createPackage(options)
        await config.createWorkspace()
        const upload = jest.mocked(objectStore.upload).mockClear()
        const imported = await config.api.project.import(file, options)
        const datasource = await expectImportedEndpoints(imported)
        expect(await fetchTemplates()).toEqual([
          expect.objectContaining({
            id: datasource.restTemplateId,
            name: "Example API",
          }),
        ])
        expect(upload).toHaveBeenCalledTimes(1)
        expect(upload).toHaveBeenCalledWith(
          expect.objectContaining({
            filename: `${config.getDevWorkspaceId()}/rest/${datasource.restTemplateId}/openapi.json`,
            body: Buffer.from(OPENAPI_SCHEMA),
          })
        )
      })
    }
  )

  it("restores the spec in a different tenant", async () => {
    const { file } = await withProjectsEnabled(createPackage)
    await config.newTenant()
    await withProjectsEnabled(async () => {
      const imported = await config.api.project.import(file)
      await expectImportedEndpoints(imported)
      expect(await fetchTemplates()).toHaveLength(1)
    })
  })

  it("reuses the spec on repeated project imports", async () => {
    await withProjectsEnabled(async () => {
      const { file } = await createPackage()
      await config.createWorkspace()
      const upload = jest.mocked(objectStore.upload).mockClear()
      const first = await config.api.project.import(file)
      const second = await config.api.project.import(file)
      const firstDatasource = await expectImportedEndpoints(first)
      const secondDatasource = await expectImportedEndpoints(second)
      expect(firstDatasource.restTemplateId).toBe(
        secondDatasource.restTemplateId
      )
      expect(await fetchTemplates()).toHaveLength(1)
      expect(upload).toHaveBeenCalledTimes(1)
    })
  })

  it("reuses equivalent spec content already uploaded under another name", async () => {
    await withProjectsEnabled(async () => {
      const { file } = await createPackage()
      await config.createWorkspace()
      const existing = await createTemplate({
        name: "Existing API",
        data: JSON.stringify(JSON.parse(OPENAPI_SCHEMA), null, 2),
      })
      const upload = jest.mocked(objectStore.upload).mockClear()
      const imported = await config.api.project.import(file)
      const datasource = await expectImportedEndpoints(imported)
      expect(datasource.restTemplateId).toBe(existing.id)
      expect(await fetchTemplates()).toHaveLength(1)
      expect(upload).not.toHaveBeenCalled()
    })
  })

  it("imports a different spec with the same name separately", async () => {
    await withProjectsEnabled(async () => {
      const { file } = await createPackage()
      await config.createWorkspace()
      const existing = await createTemplate({
        data: OPENAPI_SCHEMA.replaceAll("/items", "/users"),
      })
      const imported = await config.api.project.import(file)
      const datasource = await expectImportedEndpoints(imported)
      expect(await fetchTemplates()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: existing.id, name: "Example API" }),
          expect.objectContaining({
            id: datasource.restTemplateId,
            name: "Example API (1)",
          }),
        ])
      )
    })
  })

  it("cleans up a newly uploaded spec when the project import fails", async () => {
    await withProjectsEnabled(async () => {
      const { file } = await createPackage()
      await config.createWorkspace()
      jest
        .spyOn(sdk.datasources, "removeSecretSingle")
        .mockRejectedValueOnce(new Error("Import failed"))
      await config.api.project.import(file, undefined, { status: 500 })
      expect(await fetchTemplates()).toEqual([])
    })
  })

  it("retains a reused spec when the project import fails", async () => {
    await withProjectsEnabled(async () => {
      const { file, templateId } = await createPackage()
      jest
        .spyOn(sdk.datasources, "removeSecretSingle")
        .mockRejectedValueOnce(new Error("Import failed"))
      await config.api.project.import(file, undefined, { status: 500 })
      expect(await fetchTemplates()).toEqual([
        expect.objectContaining({ id: templateId }),
      ])
    })
  })

  it("cleans up unused specs when removing the imported project fails", async () => {
    await withProjectsEnabled(async () => {
      const { file } = await createPackage()
      await config.createWorkspace()
      const actualBulkDocs = db.DatabaseImpl.prototype.bulkDocs
      jest
        .spyOn(db.DatabaseImpl.prototype, "bulkDocs")
        .mockImplementationOnce(actualBulkDocs)
        .mockRejectedValueOnce(new Error("Query import failed"))
      jest
        .spyOn(db.DatabaseImpl.prototype, "remove")
        .mockRejectedValueOnce(new Error("Project cleanup failed"))

      await config.api.project.import(file, undefined, { status: 500 })

      expect(
        (await config.api.datasource.fetch()).filter(
          datasource => datasource.source === SourceName.REST
        )
      ).toEqual([])
      expect(await fetchTemplates()).toEqual([])
    })
  })

  it("retains specs referenced by datasources that survive import cleanup", async () => {
    await withProjectsEnabled(async () => {
      const { file } = await createPackage()
      await config.createWorkspace()
      const actualBulkDocs = db.DatabaseImpl.prototype.bulkDocs
      jest
        .spyOn(db.DatabaseImpl.prototype, "bulkDocs")
        .mockImplementationOnce(actualBulkDocs)
        .mockRejectedValueOnce(new Error("Query import failed"))
      jest
        .spyOn(db.DatabaseImpl.prototype, "bulkRemove")
        .mockRejectedValueOnce(new Error("Datasource cleanup failed"))

      await config.api.project.import(file, undefined, { status: 500 })

      const datasources = (await config.api.datasource.fetch()).filter(
        datasource => datasource.source === SourceName.REST
      )
      expect(datasources).toHaveLength(1)
      expect(await fetchTemplates()).toEqual([
        expect.objectContaining({ id: datasources[0].restTemplateId }),
      ])
    })
  })
})
