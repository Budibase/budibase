import { context, docIds, features } from "@budibase/backend-core"
import {
  DocumentType,
  FeatureFlag,
  FunctionErrorCode,
  type FunctionDocument,
  type FunctionRunSummary,
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
  const validSource = `import type { FunctionResult } from "@budibase/functions"

export default async function (): Promise<FunctionResult> {
  return { output: { ok: true } }
}`

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

  const toCapabilityInputs = (fn: FunctionDocument) =>
    fn.capabilities.map(capability => ({
      queryId: capability.queryId,
      datasourceAlias: capability.datasourceAlias,
      queryAlias: capability.queryAlias,
    }))

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

  it("validates an unsaved draft without persisting build state", async () => {
    await withFunctionsEnabled(async () => {
      const query = await createQuery()
      const draft = {
        name: "Unsaved Function",
        source: validSource,
        capabilities: [
          {
            queryId: query._id!,
            datasourceAlias: "Inventory",
            queryAlias: "findRooms",
          },
        ],
      }

      expect(await config.api.function.compile(draft)).toEqual({
        diagnostics: [],
      })
      const invalid = await config.api.function.compile({
        ...draft,
        source: `export default async function () {
  const value: string = 42
}`,
      })

      expect(invalid.diagnostics).toEqual(
        expect.arrayContaining([expect.objectContaining({ code: "TS2322" })])
      )
      expect(await config.api.function.fetch()).toEqual({ functions: [] })
    })
  })

  it("builds the saved revision and derives readiness from its artifact", async () => {
    await withFunctionsEnabled(async () => {
      const query = await createQuery()
      const { function: created } = await config.api.function.create({
        name: "Buildable Function",
        source: validSource,
        capabilities: [
          {
            queryId: query._id!,
            datasourceAlias: "Inventory",
            queryAlias: "findRooms",
          },
        ],
      })

      const { function: built } = await config.api.function.build(created._id, {
        _rev: created._rev!,
      })

      expect(built.readiness).toBe("ready")
      expect(built.lastBuild).toEqual(
        expect.objectContaining({
          status: "success",
          sourceHash: built.artifact?.sourceHash,
          declarationsHash: built.artifact?.declarationsHash,
        })
      )
      expect(built.artifact).toEqual(
        expect.objectContaining({
          compiledJavaScript: expect.stringContaining(
            "__budibaseFunctionModule"
          ),
        })
      )

      const { function: updated } = await config.api.function.update(
        built._id,
        {
          _rev: built._rev!,
          name: built.name,
          source: `${validSource}\n`,
          capabilities: toCapabilityInputs(built),
        }
      )

      expect(updated.readiness).toBe("build_required")
      expect(updated.artifact).toEqual(built.artifact)
    })
  })

  it("records a failed build while preserving the older artifact", async () => {
    await withFunctionsEnabled(async () => {
      const query = await createQuery()
      const { function: created } = await config.api.function.create({
        name: "Failed Function",
        source: validSource,
        capabilities: [
          {
            queryId: query._id!,
            datasourceAlias: "Inventory",
            queryAlias: "findRooms",
          },
        ],
      })
      const { function: built } = await config.api.function.build(created._id, {
        _rev: created._rev!,
      })
      const { function: invalid } = await config.api.function.update(
        built._id,
        {
          _rev: built._rev!,
          name: built.name,
          source: "export default function () {}",
          capabilities: toCapabilityInputs(built),
        }
      )

      const { function: failed } = await config.api.function.build(
        invalid._id,
        { _rev: invalid._rev! }
      )

      expect(failed.readiness).toBe("build_failed")
      expect(failed.artifact).toEqual(built.artifact)
      expect(failed.lastBuild).toEqual(
        expect.objectContaining({
          status: "failed",
          diagnostics: expect.arrayContaining([
            expect.objectContaining({
              code: "FUNCTION_ENTRYPOINT_INVALID",
            }),
          ]),
        })
      )
    })
  })

  it("rejects a stale build revision", async () => {
    await withFunctionsEnabled(async () => {
      const query = await createQuery()
      const { function: created } = await config.api.function.create({
        name: "Stale build",
        source: validSource,
        capabilities: [
          {
            queryId: query._id!,
            datasourceAlias: "Inventory",
            queryAlias: "findRooms",
          },
        ],
      })

      await config.api.function.update(created._id, {
        _rev: created._rev!,
        name: "Updated before build",
        source: created.source,
        capabilities: toCapabilityInputs(created),
      })
      await config.api.function.build(
        created._id,
        { _rev: created._rev! },
        { status: 409 }
      )
    })
  })

  it("requires a rebuild for changed declarations or a tampered artifact", async () => {
    await withFunctionsEnabled(async () => {
      const query = await createQuery()
      const { function: created } = await config.api.function.create({
        name: "Declaration changes",
        source: validSource,
        capabilities: [
          {
            queryId: query._id!,
            datasourceAlias: "Inventory",
            queryAlias: "findRooms",
          },
        ],
      })
      const { function: built } = await config.api.function.build(created._id, {
        _rev: created._rev!,
      })

      await config.api.query.save({
        ...query,
        parameters: [
          ...(query.parameters || []),
          { name: "roomType", default: "" },
        ],
      })
      expect(
        (await config.api.function.find(built._id)).function.readiness
      ).toBe("build_required")

      const { function: rebuilt } = await config.api.function.build(built._id, {
        _rev: built._rev!,
      })
      expect(rebuilt.readiness).toBe("ready")

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const current = await context
          .getWorkspaceDB()
          .get<FunctionDocument>(rebuilt._id)
        await context.getWorkspaceDB().put({
          ...current,
          artifact: {
            ...current.artifact!,
            sourceHash: "tampered",
          },
        })
      })

      expect(
        (await config.api.function.find(rebuilt._id)).function.readiness
      ).toBe("build_required")
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

  it("stores and returns only sanitized Function run summaries", async () => {
    await withFunctionsEnabled(async () => {
      const { function: created } = await createFunction()
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        await sdk.functions.createRunSummary({
          runId: "sanitized-run",
          functionId: created._id,
          functionName: created.name,
          sourceHash: "source-hash",
          automationId: "automation-1",
          stepId: "step-1",
        })
        await sdk.functions.finalizeRunSummary("sanitized-run", {
          runId: "sanitized-run",
          status: "error",
          output: { secretOutput: "do-not-store" },
          logs: [
            {
              level: "error",
              message: "secret-user-log",
              timestamp: new Date().toISOString(),
            },
          ],
          error: {
            code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
            message: "secret-runner-message".repeat(100),
          },
          metrics: {
            durationMs: 25,
            queryCount: 2,
            outputBytes: 10,
            logBytes: 10,
          },
        })

        const stored = await context
          .getWorkspaceDB()
          .tryGet<FunctionRunSummary>(
            docIds.generateFunctionRunLogID("sanitized-run")
          )
        expect(stored).toBeDefined()
        expect(JSON.stringify(stored)).not.toContain("secret")
        expect(stored).toMatchObject({
          status: "error",
          durationMs: 25,
          queryCount: 2,
          error: {
            code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR,
            message: "The Function query failed",
          },
        })
        expect(stored?.error?.message.length).toBeLessThanOrEqual(512)
      })

      const { run } = await config.api.function.findRun(
        created._id,
        "sanitized-run"
      )
      expect(run).not.toHaveProperty("output")
      expect(run).not.toHaveProperty("logs")
      expect(run).not.toHaveProperty("stack")
    })
  })

  it("merges development and published run history with stable pagination", async () => {
    await withFunctionsEnabled(async () => {
      const { function: created } = await createFunction()
      const putRun = async (
        workspaceId: string,
        runId: string,
        environment: FunctionRunSummary["environment"],
        startedAt: string
      ) => {
        await config.doInContext(workspaceId, async () => {
          await context.getWorkspaceDB().put({
            _id: docIds.generateFunctionRunLogID(runId),
            runId,
            functionId: created._id,
            functionName: created.name,
            sourceHash: "source-hash",
            environment,
            status: "success",
            invocation: {
              type: "automation",
              automationId: "automation-1",
              stepId: "step-1",
            },
            startedAt,
            finishedAt: startedAt,
            durationMs: 1,
            queryCount: 0,
            sensitivePayload: "do-not-return",
          })
        })
      }
      await putRun(
        config.getDevWorkspaceId(),
        "newest",
        "development",
        "2026-07-23T12:03:00.000Z"
      )
      await putRun(
        config.getProdWorkspaceId(),
        "middle",
        "published",
        "2026-07-23T12:02:00.000Z"
      )
      await putRun(
        config.getDevWorkspaceId(),
        "oldest",
        "development",
        "2026-07-23T12:01:00.000Z"
      )

      const firstPage = await config.api.function.fetchRuns(created._id, {
        limit: 2,
      })
      expect(firstPage.runs.map(run => run.runId)).toEqual(["newest", "middle"])
      expect(firstPage.runs.map(run => run.environment)).toEqual([
        "development",
        "published",
      ])
      expect(firstPage.hasMore).toBe(true)
      expect(firstPage.nextBookmark).toBeDefined()
      expect(JSON.stringify(firstPage)).not.toContain("sensitivePayload")

      const secondPage = await config.api.function.fetchRuns(created._id, {
        limit: 2,
        bookmark: firstPage.nextBookmark,
      })
      expect(secondPage.runs.map(run => run.runId)).toEqual(["oldest"])
      expect(secondPage.hasMore).toBe(false)
    })
  })

  it("reconciles interrupted runs and removes only expired summaries", async () => {
    await withFunctionsEnabled(async () => {
      const { function: created } = await createFunction()
      const interruptedId = docIds.generateFunctionRunLogID("interrupted")
      const expiredId = docIds.generateFunctionRunLogID("expired")
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const database = context.getWorkspaceDB()
        await database.put({
          _id: interruptedId,
          runId: "interrupted",
          functionId: created._id,
          functionName: created.name,
          sourceHash: "source-hash",
          environment: "development",
          status: "running",
          invocation: {
            type: "automation",
            automationId: "automation-1",
            stepId: "step-1",
          },
          startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          queryCount: 0,
        })
      })

      const { run } = await config.api.function.findRun(
        created._id,
        "interrupted"
      )
      expect(run).toMatchObject({
        status: "error",
        error: {
          code: FunctionErrorCode.FUNCTION_ORCHESTRATOR_INTERRUPTED,
        },
      })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const database = context.getWorkspaceDB()
        await database.put({
          ...run,
          _id: expiredId,
          runId: "expired",
          startedAt: "2025-01-01T00:00:00.000Z",
        })
        await sdk.functions.clearOldHistory(
          database,
          "2026-01-01T00:00:00.000Z"
        )
      })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        await expect(context.getWorkspaceDB().tryGet(expiredId)).resolves.toBe(
          undefined
        )
        await expect(
          context.getWorkspaceDB().tryGet(created._id)
        ).resolves.toBeDefined()
      })
    })
  })
})
