import { context, features } from "@budibase/backend-core"
import {
  DocumentType,
  FeatureFlag,
  type FunctionDocument,
  prefixed,
} from "@budibase/types"
import { setEnv } from "../../../environment"
import { generateAutomationID } from "../../../db/utils"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
} from "../../../tests/utilities/structures"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

describe("/functions", () => {
  const config = new TestConfiguration()
  let restoreEnv: () => void

  beforeAll(() => {
    restoreEnv = setEnv({
      SELF_HOSTED: "1",
      BUDIBASE_FUNCTIONS_ENABLED: "1",
    })
  })

  afterAll(() => {
    restoreEnv()
    config.end()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  const withFunctionsEnabled = async <T>(task: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.FUNCTIONS]: true },
      task
    )
  }

  const createQuery = async () => {
    const datasource = await config.api.datasource.create(
      basicDatasource().datasource
    )
    return await config.api.query.save({
      ...basicQuery(datasource._id!),
      name: "Find rooms",
      parameters: [
        { name: "building", default: "" },
        { name: "floor", default: "" },
      ],
    })
  }

  const createFunction = async () => {
    const query = await createQuery()
    return await config.api.function.create({
      name: "Room lookup",
      source: "export default async function {",
      capabilities: [
        {
          queryId: query._id!,
          datasourceAlias: "Inventory",
          queryAlias: "findRooms",
        },
      ],
    })
  }

  const createRestQuery = async () => {
    const datasource = await config.restDatasource({
      url: "https://example.com",
    })
    return await config.api.query.save({
      ...basicQuery(datasource._id!),
      name: "Find available rooms",
      fields: {
        path: "/rooms",
        method: "GET",
      },
      parameters: [{ name: "available-on", default: "" }],
    })
  }

  it("returns 404 when Functions are disabled", async () => {
    await config.api.function.fetch({ status: 404 })
  })

  it("only allows builders to access Function routes", async () => {
    await checkBuilderEndpoint({
      config,
      method: "GET",
      url: "/api/functions",
    })
  })

  it("catalogs Data and API Explorer queries with authoritative parameters", async () => {
    await withFunctionsEnabled(async () => {
      const dataQuery = await createQuery()
      const restQuery = await createRestQuery()

      const { queries } = await config.api.function.queryCatalog()

      expect(queries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            queryId: dataQuery._id,
            queryName: "Find rooms",
            kind: "data",
            parameters: [{ name: "building" }, { name: "floor" }],
          }),
          expect.objectContaining({
            queryId: restQuery._id,
            queryName: "Find available rooms",
            kind: "api",
            parameters: [{ name: "available-on" }],
          }),
        ])
      )
    })
  })

  it("generates declarations only for linked queries and preserves aliases on rename", async () => {
    await withFunctionsEnabled(async () => {
      const { function: created } = await createFunction()
      await createRestQuery()

      const beforeRename = await config.doInContext(
        config.getDevWorkspaceId(),
        async () => {
          const fn = await context
            .getWorkspaceDB()
            .get<FunctionDocument>(created._id)
          return await sdk.functions.getFunctionDeclarations(fn)
        }
      )

      expect(beforeRename.declarations).toContain(
        'declare module "@budibase/functions"'
      )
      expect(beforeRename.declarations).toContain('readonly "Inventory"')
      expect(beforeRename.declarations).toContain('readonly "findRooms"')
      expect(beforeRename.declarations).toContain(
        'readonly "building": string | null'
      )
      expect(beforeRename.declarations).toContain("Promise<JsonValue>")
      expect(beforeRename.declarations).not.toContain("findAvailableRooms")

      const query = await config.api.query.get(created.capabilities[0].queryId)
      await config.api.query.save({ ...query, name: "Rooms renamed" })

      const afterRename = await config.doInContext(
        config.getDevWorkspaceId(),
        async () => {
          const fn = await context
            .getWorkspaceDB()
            .get<FunctionDocument>(created._id)
          return await sdk.functions.getFunctionDeclarations(fn)
        }
      )
      const { function: fetched } = await config.api.function.find(created._id)

      expect(afterRename).toEqual(beforeRename)
      expect(fetched.capabilities[0].queryAlias).toBe("findRooms")
    })
  })

  it("rejects datasource and query alias collisions", async () => {
    await withFunctionsEnabled(async () => {
      const firstQuery = await createQuery()
      const secondQuery = await createQuery()

      await config.api.function.create(
        {
          name: "Alias collision",
          source: "",
          capabilities: [
            {
              queryId: firstQuery._id!,
              datasourceAlias: "Inventory",
              queryAlias: "findRooms",
            },
            {
              queryId: secondQuery._id!,
              datasourceAlias: "Inventory",
              queryAlias: "findAvailableRooms",
            },
          ],
        },
        { status: 400 }
      )

      const sameDatasourceQuery = await config.api.query.save({
        ...basicQuery(firstQuery.datasourceId),
        name: "Find floors",
      })
      await config.api.function.create(
        {
          name: "Query alias collision",
          source: "",
          capabilities: [
            {
              queryId: firstQuery._id!,
              datasourceAlias: "Inventory",
              queryAlias: "findRooms",
            },
            {
              queryId: sameDatasourceQuery._id!,
              datasourceAlias: "Inventory",
              queryAlias: "findRooms",
            },
          ],
        },
        { status: 400 }
      )
    })
  })

  it("rejects cross-workspace queries", async () => {
    const query = await createQuery()
    await config.createWorkspace()

    await withFunctionsEnabled(async () => {
      await config.api.function.create(
        {
          name: "Cross-workspace query",
          source: "",
          capabilities: [
            {
              queryId: query._id!,
              datasourceAlias: "Inventory",
              queryAlias: "findRooms",
            },
          ],
        },
        { status: 404 }
      )
    })
  })

  it("rejects unsupported queries and invalid parameter metadata", async () => {
    await withFunctionsEnabled(async () => {
      const unsupported = await createQuery()
      const invalidParameters = await createQuery()

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        await context.getWorkspaceDB().put({
          ...unsupported,
          queryVerb: "unsupported",
        })
        await context.getWorkspaceDB().put({
          ...invalidParameters,
          parameters: [{ name: "", default: "" }],
        })
      })

      for (const query of [unsupported, invalidParameters]) {
        await config.api.function.create(
          {
            name: "Invalid query",
            source: "",
            capabilities: [
              {
                queryId: query._id!,
                datasourceAlias: "Inventory",
                queryAlias: "findRooms",
              },
            ],
          },
          { status: 400 }
        )
      }
    })
  })

  it("persists, lists, fetches, and updates invalid TypeScript drafts", async () => {
    await withFunctionsEnabled(async () => {
      const { function: created } = await createFunction()

      expect(created._id).toStartWith(prefixed(DocumentType.FUNCTION))
      expect(created.appId).toBe(config.getDevWorkspaceId())
      expect(created.readiness).toBe("build_required")
      expect(created.capabilities).toEqual([
        expect.objectContaining({
          queryAlias: "findRooms",
          parameterNames: ["building", "floor"],
        }),
      ])
      expect(created.capabilities[0].capabilityId).toBeDefined()
      expect(created.artifact).toBeUndefined()
      expect(created.lastBuild).toBeUndefined()

      const { functions } = await config.api.function.fetch()
      expect(functions.map(fn => fn._id)).toContain(created._id)

      const { function: fetched } = await config.api.function.find(created._id)
      expect(fetched.source).toBe("export default async function {")

      const { function: updated } = await config.api.function.update(
        created._id,
        {
          _rev: created._rev!,
          name: "Updated room lookup",
          source: "still invalid TypeScript",
          capabilities: [
            {
              queryId: created.capabilities[0].queryId,
              datasourceAlias: "Inventory",
              queryAlias: "findAvailableRooms",
            },
          ],
        }
      )

      expect(updated.name).toBe("Updated room lookup")
      expect(updated.source).toBe("still invalid TypeScript")
      expect(updated.capabilities[0].capabilityId).toBe(
        created.capabilities[0].capabilityId
      )
      expect(updated.readiness).toBe("build_required")

      await config.api.function.delete(updated._id, updated._rev!)
      await config.api.function.find(updated._id, { status: 404 })
    })
  })

  it("rejects missing queries and invalid aliases", async () => {
    await withFunctionsEnabled(async () => {
      await config.api.function.create(
        {
          name: "Missing query",
          source: "",
          capabilities: [
            {
              queryId: "query_missing",
              datasourceAlias: "Inventory",
              queryAlias: "findRooms",
            },
          ],
        },
        { status: 404 }
      )

      const query = await createQuery()
      await config.api.function.create(
        {
          name: "Invalid alias",
          source: "",
          capabilities: [
            {
              queryId: query._id!,
              datasourceAlias: "Invalid alias",
              queryAlias: "findRooms",
            },
          ],
        },
        { status: 400 }
      )
    })
  })

  it("rejects client-supplied server-owned fields", async () => {
    await withFunctionsEnabled(async () => {
      const tampered = {
        name: "Tampered Function",
        source: "",
        capabilities: [],
        artifact: {
          runnerProtocolVersion: 1,
          compiledJavaScript: "malicious",
          sourceHash: "fake",
          declarationsHash: "fake",
          compiledAt: new Date().toISOString(),
        },
      }

      await config.api.function.create(tampered, { status: 400 })
    })
  })

  it("rejects stale revisions", async () => {
    await withFunctionsEnabled(async () => {
      const { function: created } = await createFunction()
      const update = {
        _rev: created._rev!,
        name: "Updated once",
        source: created.source,
        capabilities: created.capabilities.map(capability => ({
          queryId: capability.queryId,
          datasourceAlias: capability.datasourceAlias,
          queryAlias: capability.queryAlias,
        })),
      }

      await config.api.function.update(created._id, update)
      await config.api.function.update(
        created._id,
        { ...update, name: "Stale update" },
        { status: 409 }
      )
    })
  })

  it("does not fetch or delete another document type", async () => {
    await withFunctionsEnabled(async () => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )

      await config.api.function.find(datasource._id!, { status: 404 })
      await config.api.function.delete(datasource._id!, datasource._rev!, {
        status: 404,
      })

      expect(await config.api.datasource.get(datasource._id!)).toBeDefined()
    })
  })

  it("blocks deletion while an automation references the Function", async () => {
    await withFunctionsEnabled(async () => {
      const { function: created } = await createFunction()

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        await context.getWorkspaceDB().put({
          _id: generateAutomationID(),
          name: "Room workflow",
          appId: config.getDevWorkspaceId(),
          definition: {
            trigger: {},
            steps: [
              {
                stepId: "EXECUTE_FUNCTION",
                inputs: { functionId: created._id },
              },
            ],
          },
        })
      })

      await config.api.function.delete(created._id, created._rev!, {
        status: 409,
        body: {
          message: "Function is used by: Room workflow.",
        },
      })
    })
  })
})
