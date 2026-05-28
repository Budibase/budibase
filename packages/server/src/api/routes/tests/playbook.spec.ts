import { context, features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import {
  FeatureFlag,
  type PlaybookPackageDependencyIndex,
} from "@budibase/types"
import { Header } from "@budibase/shared-core"
import fsp from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { Readable, Writable } from "stream"
import { pipeline } from "stream/promises"
import * as tar from "tar"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
  basicScreen,
  basicTable,
  createQueryScreen,
} from "../../../tests/utilities/structures"

describe("/playbooks", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const withPlaybooksEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PLAYBOOKS]: true },
      f
    )
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  const readTarEntries = async (buffer: Buffer) => {
    const files = new Map<string, Buffer>()
    const parser = tar.list({
      onReadEntry: entry => {
        if (entry.type === "Directory") {
          return
        }

        const chunks: Buffer[] = []
        entry.on("data", chunk => chunks.push(chunk))
        entry.on("end", () => {
          files.set(
            entry.path,
            Buffer.concat(chunks.map(chunk => new Uint8Array(chunk)))
          )
        })
      },
    })
    await pipeline(Readable.from(buffer), parser as unknown as Writable)
    return files
  }

  const createTarPackage = async (entries: Record<string, unknown>) => {
    const tmpPath = await fsp.mkdtemp(join(tmpdir(), "playbook-package-"))
    const tarPath = join(tmpPath, "playbook-export.tar.gz")

    try {
      await Promise.all(
        Object.entries(entries).map(async ([entryPath, value]) => {
          const fullPath = join(tmpPath, entryPath)
          await fsp.mkdir(join(fullPath, ".."), { recursive: true })
          await fsp.writeFile(fullPath, JSON.stringify(value, null, 2))
        })
      )
      await tar.create(
        {
          gzip: true,
          file: tarPath,
          cwd: tmpPath,
        },
        Object.keys(entries)
      )
      return await fsp.readFile(tarPath)
    } finally {
      await fsp.rm(tmpPath, { recursive: true, force: true })
    }
  }

  const createMinimalPackageEntries = (
    overrides: {
      manifest?: Record<string, unknown>
      playbook?: Record<string, unknown>
      dependencyIndex?: Record<string, unknown>
      docs?: Record<string, unknown>
      extraEntries?: Record<string, unknown>
    } = {}
  ) => {
    const playbook = {
      _id: "playbook_source",
      name: "Operations",
      createdAt: new Date().toISOString(),
      ...overrides.playbook,
    }
    const manifest = {
      formatVersion: 1,
      artifactType: "playbook",
      budibaseVersion: "test",
      exportedAt: new Date().toISOString(),
      playbook,
      sourceWorkspace: {
        id: "app_source",
      },
      resourcesByType: {
        playbook: 1,
      },
      containsRows: false,
      containsAttachments: false,
      requiresSecrets: false,
      unsupportedContent: [],
      supportedImportModes: ["additiveImport"],
      ...overrides.manifest,
    }
    const dependencyIndex = {
      rootPlaybookId: "playbook_source",
      directMembers: [],
      resources: {
        playbook_source: {
          dependencies: [],
        },
      },
      ...overrides.dependencyIndex,
    }

    return {
      "manifest.json": manifest,
      "playbook.json": playbook,
      "dependency-index.json": dependencyIndex,
      ...overrides.docs,
      ...overrides.extraEntries,
    }
  }

  it("returns 404 when the feature flag is disabled", async () => {
    await config.api.playbook.fetch({ status: 404 })
  })

  it("creates and fetches playbooks when the feature is enabled", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
        description: "Operational workflows",
        color: "#8CA171",
      })

      expect(playbook._id).toBeDefined()
      expect(playbook.name).toBe("Operations")

      const { playbooks } = await config.api.playbook.fetch()
      expect(playbooks.map(existing => existing._id)).toContain(playbook._id)
    })
  })

  it("updates playbooks without client timestamps", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
        description: "Initial",
      })

      const updated = await config.api.playbook.update({
        _id: playbook._id,
        _rev: playbook._rev,
        name: "Operations revised",
        description: "Updated",
        color: "#8CA171",
      })

      expect(updated.playbook.name).toBe("Operations revised")
      expect(updated.playbook.description).toBe("Updated")
      expect(updated.playbook.createdAt).toBe(playbook.createdAt)
    })
  })

  it("rejects path and body playbook id mismatches on update", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })

      await config.api.playbook.update(
        {
          ...playbook,
          name: "Updated operations",
        },
        {
          status: 400,
          body: {
            message: "Path and body ids do not match",
          },
        },
        "playbook_mismatch"
      )
    })
  })

  it("rejects assigning an unknown playbook id", async () => {
    await withPlaybooksEnabled(async () => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )

      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          playbookId: "playbook_missing",
        }),
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )

      const automation = await config.createAutomation()
      await config.api.automation.update(
        {
          ...automation,
          playbookId: "playbook_missing",
        },
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )

      await config.api.agent.create(
        {
          name: "Ops agent",
          aiconfig: "default",
          playbookId: "playbook_missing",
        },
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )

      await config.api.table.save(
        {
          ...basicTable(),
          playbookId: "playbook_missing",
        },
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )

      await config.api.query.save(
        {
          ...basicQuery(datasource._id!),
          playbookId: "playbook_missing",
        },
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )

      await config.api.datasource.create(
        {
          ...basicDatasource().datasource,
          playbookId: "playbook_missing",
        },
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )
    })
  })

  it("rejects assigning a playbook while the feature is disabled", async () => {
    await config.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name: "Ops app",
        url: "/ops-app",
        playbookId: "playbook_1",
      }),
      {
        status: 404,
        body: {
          message: "Playbooks feature is not enabled.",
        },
      }
    )
  })

  it("clears assignments when deleting a playbook", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          playbookId: playbook._id,
        })
      )

      const automation = await config.createAutomation()
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automation,
          playbookId: playbook._id,
        })

      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        playbookId: playbook._id,
      })

      const table = await config.api.table.save({
        ...basicTable(),
        playbookId: playbook._id,
      })

      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        playbookId: playbook._id,
      })

      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        playbookId: playbook._id,
      })

      await config.api.playbook.delete(playbook._id, playbook._rev)

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.playbookId).toBeUndefined()

      const fetchedAutomation = await config.api.automation.get(
        updatedAutomation._id!
      )
      expect(fetchedAutomation.playbookId).toBeUndefined()

      const { agents } = await config.api.agent.fetch()
      const fetchedAgent = agents.find(existing => existing._id === agent._id)
      expect(fetchedAgent?.playbookId).toBeUndefined()

      const fetchedTable = await config.api.table.get(table._id!)
      expect(fetchedTable.playbookId).toBeUndefined()

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.playbookId).toBeUndefined()

      const fetchedQuery = await config.api.query.get(query._id!)
      expect(fetchedQuery.playbookId).toBeUndefined()
    })
  })

  it("does not clear assignments when deleting with a stale rev", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          playbookId: playbook._id,
        })
      )

      await config.api.playbook.delete(playbook._id, "1-stale", {
        status: 409,
      })

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.playbookId).toBe(playbook._id)
    })
  })

  it("preserves assignments when updates omit playbook ids", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          playbookId: playbook._id,
        })
      )
      const automation = await config.createAutomation()
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...automation,
          playbookId: playbook._id,
        })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        playbookId: playbook._id,
      })
      const table = await config.api.table.save({
        ...basicTable(),
        playbookId: playbook._id,
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        playbookId: playbook._id,
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        playbookId: playbook._id,
      })

      const { workspaceApp: updatedWorkspaceApp } =
        await config.api.workspaceApp.update({
          _id: workspaceApp._id,
          _rev: workspaceApp._rev,
          name: "Ops app updated",
          url: workspaceApp.url,
          navigation: workspaceApp.navigation,
          theme: workspaceApp.theme,
          customTheme: workspaceApp.customTheme,
          disabled: workspaceApp.disabled,
        })

      const { playbookId: _automationPlaybookId, ...automationUpdate } =
        assignedAutomation
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automationUpdate,
          name: "Ops automation updated",
        })

      const { playbookId: _agentPlaybookId, ...agentUpdate } = agent
      const updatedAgent = await config.api.agent.update({
        ...agentUpdate,
        name: "Ops agent updated",
      })

      const { playbookId: _tablePlaybookId, ...tableUpdate } = table
      const updatedTable = await config.api.table.save({
        ...tableUpdate,
        name: "Ops table updated",
      })

      const { playbookId: _datasourcePlaybookId, ...datasourceUpdate } =
        datasource
      const updatedDatasource = await config.api.datasource.update({
        ...datasourceUpdate,
        name: "Ops datasource updated",
      })

      const { playbookId: _queryPlaybookId, ...queryUpdate } = query
      const updatedQuery = await config.api.query.save({
        ...queryUpdate,
        name: "Ops query updated",
      })

      expect(updatedWorkspaceApp.playbookId).toBe(playbook._id)
      expect(updatedAutomation.playbookId).toBe(playbook._id)
      expect(updatedAgent.playbookId).toBe(playbook._id)
      expect(updatedTable.playbookId).toBe(playbook._id)
      expect(updatedDatasource.playbookId).toBe(playbook._id)
      expect(updatedQuery.playbookId).toBe(playbook._id)
    })
  })

  it("exports a playbook tarball with selective docs and manifest", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
        description: "Operational workflows",
        color: "#8CA171",
      })

      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        config: {
          password: "super-secret",
        },
        playbookId: playbook._id,
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        playbookId: playbook._id,
      })
      const table = await config.api.table.save({
        ...basicTable(),
        playbookId: playbook._id,
      })
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Operations app",
        url: "/operations-app",
        playbookId: playbook._id,
      })
      const screen = await config.api.screen.save({
        ...createQueryScreen(datasource._id!, query),
        workspaceAppId: workspaceApp._id,
      })

      const automation = await config.createAutomation()
      await config.api.automation.update({
        ...automation,
        playbookId: playbook._id,
      })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        live: true,
        slackIntegration: {
          botToken: "secret-token",
          signingSecret: "secret-signing-key",
        },
        telegramIntegration: {
          botToken: "secret-telegram-token",
          webhookSecretToken: "secret-telegram-webhook",
          botUserName: "ops_bot",
        },
        playbookId: playbook._id,
      })

      const body = await config.api.playbook.export(playbook._id)
      const files = await readTarEntries(body)

      expect(Array.from(files.keys())).toEqual(
        expect.arrayContaining([
          "manifest.json",
          "playbook.json",
          "dependency-index.json",
          `docs/datasource/${datasource._id}.json`,
          `docs/query/${query._id}.json`,
          `docs/table/${table._id}.json`,
          `docs/automation/${automation._id}.json`,
          `docs/agent/${agent._id}.json`,
          `docs/workspace_app/${workspaceApp._id}.json`,
          `docs/screen/${screen._id}.json`,
        ])
      )

      const manifest = JSON.parse(files.get("manifest.json")!.toString())
      expect(manifest).toMatchObject({
        artifactType: "playbook",
        formatVersion: 1,
        containsRows: false,
        containsAttachments: false,
        requiresSecrets: true,
        playbook: {
          _id: playbook._id,
          name: playbook.name,
          description: playbook.description,
          color: playbook.color,
        },
        resourcesByType: {
          playbook: 1,
          datasource: 1,
          query: 1,
          table: 1,
          automation: 1,
          agent: 1,
          workspace_app: 1,
          screen: 1,
        },
        unsupportedContent: [
          {
            type: "agent_linked_content",
            count: 1,
          },
        ],
        supportedImportModes: ["additiveImport"],
      })

      const exportedPlaybook = JSON.parse(
        files.get("playbook.json")!.toString()
      )
      expect(exportedPlaybook._id).toBe(playbook._id)
      expect(exportedPlaybook._rev).toBeUndefined()

      const exportedDatasource = JSON.parse(
        files.get(`docs/datasource/${datasource._id}.json`)!.toString()
      )
      expect(exportedDatasource.config.password).not.toBe("super-secret")

      const exportedAgent = JSON.parse(
        files.get(`docs/agent/${agent._id}.json`)!.toString()
      )
      expect(exportedAgent.live).toBe(false)
      expect(exportedAgent.slackIntegration?.botToken).toBeUndefined()
      expect(exportedAgent.slackIntegration?.signingSecret).toBeUndefined()
      expect(exportedAgent.telegramIntegration?.botToken).toBeUndefined()
      expect(
        exportedAgent.telegramIntegration?.webhookSecretToken
      ).toBeUndefined()
      expect(exportedAgent.telegramIntegration?.botUserName).toBe("ops_bot")

      const dependencyIndex = JSON.parse(
        files.get("dependency-index.json")!.toString()
      ) as PlaybookPackageDependencyIndex
      expect(dependencyIndex.rootPlaybookId).toBe(playbook._id)
      expect(
        dependencyIndex.directMembers.map(resource => resource.id)
      ).toEqual(
        expect.arrayContaining([
          datasource._id,
          query._id,
          table._id,
          automation._id,
          agent._id,
          workspaceApp._id,
        ])
      )
    })
  })

  it("returns 404 when exporting an unknown playbook", async () => {
    await withPlaybooksEnabled(async () => {
      await config.api.playbook.export("playbook_missing", undefined, {
        status: 404,
        body: {
          message: "Playbook with id 'playbook_missing' not found.",
        },
      })
    })
  })

  it("exports encrypted playbook tarballs when requested", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })

      const body = await config.api.playbook.export(playbook._id, {
        encryptPassword: "abcde",
      })
      const files = await readTarEntries(body)

      expect(Array.from(files.keys())).toEqual(
        expect.arrayContaining([
          "manifest.json.enc",
          "playbook.json.enc",
          "dependency-index.json.enc",
        ])
      )
    })
  })

  it("imports empty playbooks without requiring docs", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })

      const body = await config.api.playbook.export(playbook._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.playbook.import(body)
          expect(imported.resources).toEqual({
            playbook: [imported.playbook._id],
          })
        }
      )
    })
  })

  it("exports and imports app screens that need workspace app repair", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })
      const defaultWorkspaceApp = await config.api.workspaceApp.find(
        config.getDefaultWorkspaceAppId()
      )
      const { workspaceApp } = await config.api.workspaceApp.update({
        _id: defaultWorkspaceApp._id,
        _rev: defaultWorkspaceApp._rev,
        name: defaultWorkspaceApp.name,
        url: defaultWorkspaceApp.url,
        disabled: defaultWorkspaceApp.disabled,
        navigation: defaultWorkspaceApp.navigation,
        playbookId: playbook._id,
      })
      const screen = await config.api.screen.save({
        ...basicScreen("/operations"),
        workspaceAppId: workspaceApp._id,
      })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        await db.put({
          ...screen,
          workspaceAppId: undefined,
        })
      })

      const body = await config.api.playbook.export(playbook._id)
      const files = await readTarEntries(body)
      const exportedScreen = JSON.parse(
        files.get(`docs/screen/${screen._id}.json`)!.toString()
      )

      expect(exportedScreen.workspaceAppId).toBe(workspaceApp._id)

      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.playbook.import(body)
          const importedScreens = await config.api.screen.list()
          const importedScreen = importedScreens.find(
            existing => existing._id === imported.resources.screen?.[0]
          )

          expect(imported.resources.workspace_app).toHaveLength(1)
          expect(imported.resources.screen).toHaveLength(1)
          expect(importedScreen?.workspaceAppId).toBe(
            imported.resources.workspace_app?.[0]
          )
        }
      )
    })
  })

  it("imports row action dependencies with remapped automation references", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })
      const table = await config.api.table.save({
        ...basicTable(),
        playbookId: playbook._id,
      })
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Approve",
      })

      const body = await config.api.playbook.export(playbook._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.playbook.import(body)
          expect(imported.resources.table).toHaveLength(1)
          expect(imported.resources.automation).toHaveLength(1)
          expect(imported.resources.row_action).toHaveLength(1)

          const importedRowActions = await config.api.rowAction.find(
            imported.resources.table?.[0]!
          )
          const importedAction = Object.values(importedRowActions.actions)[0]

          expect(importedAction).toBeDefined()
          expect(importedAction.tableId).toBe(imported.resources.table?.[0])
          expect(importedAction.automationId).toBe(
            imported.resources.automation?.[0]
          )
          expect(importedAction.id).not.toBe(rowAction.id)

          const importedAutomation = await config.api.automation.get(
            imported.resources.automation?.[0]!
          )
          const triggerInputs = importedAutomation.definition.trigger
            .inputs as {
            tableId?: string
            rowActionId?: string
          }
          expect(triggerInputs.tableId).toBe(imported.resources.table?.[0])
          expect(triggerInputs.rowActionId).toBe(importedAction.id)
        }
      )
    })
  })

  it("imports exported playbooks additively into another workspace", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
        description: "Operational workflows",
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        config: {
          password: "super-secret",
        },
        playbookId: playbook._id,
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        playbookId: playbook._id,
      })
      const table = await config.api.table.save({
        ...basicTable(),
        playbookId: playbook._id,
      })
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Operations app",
        url: "/operations-app",
        playbookId: playbook._id,
      })
      const screen = await config.api.screen.save({
        ...createQueryScreen(datasource._id!, query),
        workspaceAppId: workspaceApp._id,
      })
      const automation = await config.createAutomation()
      await config.api.automation.update({
        ...automation,
        playbookId: playbook._id,
      })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        live: true,
        slackIntegration: {
          botToken: "secret-token",
          signingSecret: "secret-signing-key",
        },
        playbookId: playbook._id,
      })

      const body = await config.api.playbook.export(playbook._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          await config.api.workspaceApp.create({
            name: "Existing app",
            url: "/existing-app",
          })

          const imported = await config.api.playbook.import(body)
          expect(imported.playbook._id).not.toBe(playbook._id)
          expect(imported.resources.playbook).toEqual([imported.playbook._id])
          expect(imported.resources.datasource).toHaveLength(1)
          expect(imported.resources.query).toHaveLength(1)
          expect(imported.resources.table).toHaveLength(1)
          expect(imported.resources.automation).toHaveLength(1)
          expect(imported.resources.agent).toHaveLength(1)
          expect(imported.resources.workspace_app).toHaveLength(1)
          expect(imported.resources.screen).toHaveLength(1)
          expect(imported.requirements).toHaveLength(2)
          expect(imported.requirements).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: "datasource_secrets",
                resourceId: imported.resources.datasource?.[0],
              }),
              expect.objectContaining({
                type: "agent_secrets",
                resourceId: imported.resources.agent?.[0],
              }),
            ])
          )

          const { playbooks } = await config.api.playbook.fetch()
          expect(playbooks.map(existing => existing._id)).toContain(
            imported.playbook._id
          )

          const importedWorkspaceApps = await config.api.workspaceApp.fetch()
          expect(
            importedWorkspaceApps.workspaceApps.map(app => app.name)
          ).toEqual(expect.arrayContaining(["Existing app", "Operations app"]))

          const importedScreens = await config.api.screen.list()
          const importedScreen = importedScreens.find(
            screen => screen._id === imported.resources.screen?.[0]
          )
          expect(importedScreen).toBeDefined()
          expect(importedScreen!.workspaceAppId).toBe(
            imported.resources.workspace_app?.[0]
          )
          expect(importedScreen!.props._children?.[0].table._id).toBe(
            imported.resources.query?.[0]
          )
          expect(importedScreen!.props._children?.[0].table.datasourceId).toBe(
            imported.resources.datasource?.[0]
          )

          const importedQuery = await config.api.query.get(
            imported.resources.query?.[0]!
          )
          expect(importedQuery.datasourceId).toBe(
            imported.resources.datasource?.[0]
          )
          expect(importedQuery.playbookId).toBe(imported.playbook._id)

          const importedTable = await config.api.table.get(
            imported.resources.table?.[0]!
          )
          expect(importedTable.playbookId).toBe(imported.playbook._id)

          const importedAutomation = await config.api.automation.get(
            imported.resources.automation?.[0]!
          )
          expect(importedAutomation.playbookId).toBe(imported.playbook._id)
          expect(importedAutomation.appId).toBe(destinationWorkspace.appId)
          expect(importedAutomation.disabled).toBe(true)

          const importedDatasource = await config.api.datasource.get(
            imported.resources.datasource?.[0]!
          )
          expect(importedDatasource.playbookId).toBe(imported.playbook._id)
          expect(importedDatasource.config?.password).not.toBe("super-secret")

          const { agents } = await config.api.agent.fetch()
          const importedAgent = agents.find(
            existing => existing._id === imported.resources.agent?.[0]
          )
          expect(importedAgent).toBeDefined()
          expect(importedAgent?.playbookId).toBe(imported.playbook._id)
          expect(importedAgent?.live).toBe(false)

          const resourceGraph =
            await config.api.resource.getResourceDependencies()
          expect(
            resourceGraph.body.resources[
              imported.playbook._id
            ].dependencies.map(resource => resource.id)
          ).toEqual(
            expect.arrayContaining([
              imported.resources.datasource?.[0],
              imported.resources.query?.[0],
              imported.resources.table?.[0],
              imported.resources.automation?.[0],
              imported.resources.agent?.[0],
              imported.resources.workspace_app?.[0],
              imported.resources.screen?.[0],
            ])
          )
        }
      )

      expect(screen._id).toBeDefined()
      expect(table._id).toBeDefined()
      expect(agent._id).toBeDefined()
    })
  })

  it("rejects encrypted playbook imports without a password", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })

      const body = await config.api.playbook.export(playbook._id, {
        encryptPassword: "abcde",
      })

      await config.api.playbook.import(body, undefined, {
        status: 400,
        body: {
          message: "Files are encrypted but no password has been supplied.",
        },
      })
    })
  })

  it("rejects packages with docs that are not declared in the dependency index", async () => {
    await withPlaybooksEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              playbook: 1,
              automation: 1,
            },
          },
          docs: {
            "docs/automation/au_extra.json": {
              _id: "au_extra",
              name: "Unexpected automation",
              definition: {
                trigger: {
                  id: "trigger",
                  inputs: {},
                },
                steps: [],
              },
            },
          },
        })
      )

      await config.api.playbook.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message:
            "Playbook package contains docs not listed in dependency-index.json.",
        },
      })
    })
  })

  it("rejects packages that reference missing docs", async () => {
    await withPlaybooksEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              playbook: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              playbook_source: {
                dependencies: [
                  {
                    id: "au_missing",
                    name: "Missing automation",
                    type: "automation",
                  },
                ],
              },
              au_missing: {
                dependencies: [],
              },
            },
          },
        })
      )

      await config.api.playbook.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Playbook package dependency index references missing docs.",
        },
      })
    })
  })

  it("rejects packages with docs that are not reachable from the playbook", async () => {
    await withPlaybooksEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              playbook: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              playbook_source: {
                dependencies: [],
              },
              au_orphan: {
                dependencies: [],
              },
            },
          },
          docs: {
            "docs/automation/au_orphan.json": {
              _id: "au_orphan",
              name: "Orphan automation",
              definition: {
                trigger: {
                  id: "trigger",
                  inputs: {},
                },
                steps: [],
              },
            },
          },
        })
      )

      await config.api.playbook.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message:
            "Playbook package contains docs that are not reachable from the root playbook.",
        },
      })
    })
  })

  it("rejects packages when doc paths do not match resource types", async () => {
    await withPlaybooksEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              playbook: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              playbook_source: {
                dependencies: [
                  {
                    id: "ta_wrong",
                    name: "Wrongly typed table",
                    type: "automation",
                  },
                ],
              },
              ta_wrong: {
                dependencies: [],
              },
            },
          },
          docs: {
            "docs/automation/ta_wrong.json": {
              _id: "ta_wrong",
              name: "Wrongly typed table",
            },
          },
        })
      )

      await config.api.playbook.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message:
            "Playbook package doc 'ta_wrong' does not match resource type 'automation'.",
        },
      })
    })
  })

  it("rejects packages with unsupported root files", async () => {
    await withPlaybooksEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          extraEntries: {
            "readme.txt": "unexpected",
          },
        })
      )

      await config.api.playbook.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Playbook package contains unsupported files.",
        },
      })
    })
  })

  it("rejects workspace exports", async () => {
    await withPlaybooksEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          extraEntries: {
            "db.txt": "workspace export marker",
          },
        })
      )

      await config.api.playbook.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Workspace exports cannot be imported as Playbook packages.",
        },
      })
    })
  })

  it("rejects packages with paths that are too deep", async () => {
    await withPlaybooksEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              playbook: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              playbook_source: {
                dependencies: [
                  {
                    id: "au_deep",
                    name: "Deep automation",
                    type: "automation",
                  },
                ],
              },
              au_deep: {
                dependencies: [],
              },
            },
          },
          docs: {
            "docs/automation/nested/deeper/au_deep.json": {
              _id: "au_deep",
              name: "Deep automation",
            },
          },
        })
      )

      await config.api.playbook.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Playbook package contains paths that are too deep.",
        },
      })
    })
  })
})
