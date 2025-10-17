import { context, Header } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { WorkspaceMigration } from ".."
import * as setup from "../../api/routes/tests/utilities"
import { setEnv, withEnv } from "../../environment"
import sdk from "../../sdk"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { MIGRATIONS } from "../migrations"
import { processMigrations } from "../migrationsProcessor"
import {
  getWorkspaceMigrationVerions,
  updateWorkspaceMigrationMetadata,
} from "../workspaceMigrationMetadata"

function generateMigrationId() {
  return generator.guid()
}

describe.each([true, false])("migrationsProcessor", fromProd => {
  let config: TestConfiguration

  beforeAll(async () => {
    setEnv({ DISABLE_WORKSPACE_MIGRATIONS: false })

    config = setup.getConfig()
    await config.init()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await config.newTenant()
  })

  async function runMigrations(migrations: WorkspaceMigration[]) {
    const fromAppId = fromProd
      ? config.getProdWorkspaceId()
      : config.getDevWorkspaceId()
    await config.doInContext(fromAppId, () =>
      processMigrations(fromAppId, migrations)
    )
  }

  async function expectMigrationVersion(expectedVersion: string) {
    for (const appId of [
      config.getDevWorkspaceId(),
      config.getProdWorkspaceId(),
    ]) {
      expect(
        await config.doInContext(appId, () =>
          getWorkspaceMigrationVerions(appId)
        )
      ).toBe(expectedVersion)
    }
  }

  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: WorkspaceMigration[] = [
      { id: generateMigrationId(), func: async () => {} },
      { id: generateMigrationId(), func: async () => {} },
      { id: generateMigrationId(), func: async () => {} },
    ]

    await runMigrations(testMigrations)

    await expectMigrationVersion(testMigrations[2].id)
  })

  it("syncs the dev workspace before applying each migration", async () => {
    const executionOrder: string[] = []
    let syncCallCount = 0

    jest.spyOn(sdk.workspaces, "syncWorkspace").mockImplementation(async () => {
      syncCallCount++
      executionOrder.push(`sync-${syncCallCount}`)
      return undefined as any
    })

    const testMigrations = Array.from({ length: 3 }).map<WorkspaceMigration>(
      (_, i) => ({
        id: generateMigrationId(),
        func: async () => {
          const db = context.getWorkspaceDB()
          executionOrder.push(`${db.name}-migration-${i + 1}`)
        },
      })
    )

    await runMigrations(testMigrations)

    await expectMigrationVersion(testMigrations[2].id)

    expect(executionOrder).toEqual([
      `${config.getProdWorkspaceId()}-migration-1`,
      "sync-1",
      `${config.getDevWorkspaceId()}-migration-1`,
      `${config.getProdWorkspaceId()}-migration-2`,
      "sync-2",
      `${config.getDevWorkspaceId()}-migration-2`,
      `${config.getProdWorkspaceId()}-migration-3`,
      "sync-3",
      `${config.getDevWorkspaceId()}-migration-3`,
    ])
  })

  it("runs all the migrations in doInAppMigrationContext", async () => {
    let migrationCallPerApp: Record<string, number> = {}

    const testMigrations = Array.from({ length: 3 }).map<WorkspaceMigration>(
      _ => ({
        id: generateMigrationId(),
        func: async () => {
          expect(context.getCurrentContext()?.isMigrating).toBe(true)
          migrationCallPerApp[context.getWorkspaceId()!] ??= 0
          migrationCallPerApp[context.getWorkspaceId()!]++
        },
      })
    )

    await runMigrations(testMigrations)

    expect(Object.keys(migrationCallPerApp)).toEqual([
      config.getProdWorkspaceId(),
      config.getDevWorkspaceId(),
    ])
    expect(migrationCallPerApp[config.getDevWorkspaceId()]).toBe(3)
    expect(migrationCallPerApp[config.getProdWorkspaceId()]).toBe(3)
  })

  it("no context can be initialised within a migration", async () => {
    const testMigrations: WorkspaceMigration[] = [
      {
        id: generateMigrationId(),
        func: async () => {
          await context.doInWorkspaceMigrationContext(
            config.getDevWorkspaceId(),
            () => {}
          )
        },
      },
    ]

    await expect(runMigrations(testMigrations)).rejects.toThrow(
      "The context cannot be changed, a migration is currently running"
    )
  })

  describe("array index-based migration processing", () => {
    it("should run migrations in correct order based on array position", async () => {
      const executionOrder: string[] = []
      const testMigrations: WorkspaceMigration[] = [
        {
          id: `migration_a`,
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - 1`)
          },
        },
        {
          id: `migration_c`,
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - 3`)
          },
        },
        {
          id: `migration_b`,
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - 2`)
          },
        },
      ]

      await runMigrations(testMigrations)

      expect(executionOrder).toEqual([
        `${config.getProdWorkspaceId()} - 1`,
        `${config.getDevWorkspaceId()} - 1`,
        `${config.getProdWorkspaceId()} - 3`,
        `${config.getDevWorkspaceId()} - 3`,
        `${config.getProdWorkspaceId()} - 2`,
        `${config.getDevWorkspaceId()} - 2`,
      ])
    })

    it("should skip migrations that come before current version in array", async () => {
      const executionOrder: string[] = []
      const testMigrations: WorkspaceMigration[] = [
        {
          id: generateMigrationId(),
          func: async () => {
            throw "This should not be call"
          },
        },
        {
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - 2`)
          },
        },
        {
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - 3`)
          },
        },
      ]

      for (const workspaceId of [
        config.getDevWorkspaceId(),
        config.getProdWorkspaceId(),
      ]) {
        await config.doInContext(workspaceId, async () => {
          await updateWorkspaceMigrationMetadata({
            workspaceId,
            version: testMigrations[0].id,
          })
        })
      }

      await runMigrations(testMigrations)

      expect(executionOrder).toEqual([
        `${config.getProdWorkspaceId()} - 2`,
        `${config.getDevWorkspaceId()} - 2`,
        `${config.getProdWorkspaceId()} - 3`,
        `${config.getDevWorkspaceId()} - 3`,
      ])
    })

    it("should handle when current version is not found in migrations array", async () => {
      const executionOrder: string[] = []
      const testMigrations = Array.from({ length: 2 }).map<WorkspaceMigration>(
        (_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - ${i + 1}`)
          },
        })
      )

      const workspaceId = config.getDevWorkspaceId()
      await config.doInContext(workspaceId, async () => {
        // Set a version that doesn't exist in the migrations array
        await updateWorkspaceMigrationMetadata({
          workspaceId: workspaceId,
          version: "nonexistent_version",
        })
      })

      await runMigrations(testMigrations)

      // Should run all migrations
      expect(executionOrder).toEqual([
        `${config.getProdWorkspaceId()} - 1`,
        `${config.getDevWorkspaceId()} - 1`,
        `${config.getProdWorkspaceId()} - 2`,
        `${config.getDevWorkspaceId()} - 2`,
      ])
    })

    it("should not run any migrations when current version is the last in array", async () => {
      const executionOrder: number[] = []
      const testMigrations = Array.from({ length: 2 }).map<WorkspaceMigration>(
        (_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            executionOrder.push(i + 1)
          },
        })
      )

      // Run all migrations first
      await runMigrations(testMigrations)

      // Clear execution order and run again
      executionOrder.length = 0

      await runMigrations(testMigrations)

      // Should not execute any migrations
      expect(executionOrder).toEqual([])
    })
  })

  describe("disabled migrations", () => {
    it("should stop processing when encountering a disabled migration", async () => {
      const executionOrder: string[] = []
      const testMigrations = Array.from({ length: 3 }).map<WorkspaceMigration>(
        (_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - ${i + 1}`)
          },
        })
      )
      testMigrations[1].disabled = true

      await runMigrations(testMigrations)

      // Should only run the first migration, then stop at the disabled one
      expect(executionOrder).toEqual([
        `${config.getProdWorkspaceId()} - 1`,
        `${config.getDevWorkspaceId()} - 1`,
      ])
    })

    it("should not run any migrations if the first pending migration is disabled", async () => {
      const executionOrder: number[] = []
      const testMigrations = Array.from({ length: 2 }).map<WorkspaceMigration>(
        (_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            executionOrder.push(i + 1)
          },
        })
      )
      testMigrations[0].disabled = true

      const appId = config.getDevWorkspaceId()

      await config.doInContext(appId, () =>
        processMigrations(appId, testMigrations)
      )

      // Should not run any migrations
      expect(executionOrder).toEqual([])
    })
  })

  describe("published workspace handling", () => {
    let spySyncWorkspace: jest.SpyInstance

    beforeEach(() => {
      spySyncWorkspace = jest.spyOn(sdk.workspaces, "syncWorkspace")
    })

    it("should sync dev workspace after migrating published workspace", async () => {
      const testMigrations: WorkspaceMigration[] = [
        {
          id: generateMigrationId(),
          func: async () => {
            throw "This should not be call"
          },
        },
        {
          id: generateMigrationId(),
          func: async () => {},
        },
        {
          id: generateMigrationId(),
          func: async () => {},
        },
      ]

      for (const workspaceId of [
        config.getDevWorkspaceId(),
        config.getProdWorkspaceId(),
      ]) {
        await config.doInContext(workspaceId, async () => {
          await updateWorkspaceMigrationMetadata({
            workspaceId,
            version: testMigrations[0].id,
          })
        })
      }
      spySyncWorkspace.mockClear()

      await runMigrations(testMigrations)

      expect(spySyncWorkspace).toHaveBeenCalledTimes(2)
      expect(spySyncWorkspace).toHaveBeenCalledWith(config.getDevWorkspaceId())
    })

    it("should update migration metadata for both prod and dev workspaces", async () => {
      const testMigrations: WorkspaceMigration[] = [
        {
          id: generateMigrationId(),
          func: async () => {},
        },
      ]

      await expectMigrationVersion(MIGRATIONS[MIGRATIONS.length - 1].id)

      await runMigrations(testMigrations)

      await expectMigrationVersion(testMigrations[0].id)
    })

    !fromProd &&
      it("should migrate dev workspace when workspace is not published", async () => {
        const executionOrder: string[] = []
        const testMigrations: WorkspaceMigration[] = [
          {
            id: generateMigrationId(),
            func: async () => {
              const db = context.getWorkspaceDB()
              executionOrder.push(db.name)
            },
          },
        ]

        spySyncWorkspace.mockClear()
        await config.unpublish()

        const devAppId = config.getDevWorkspaceId()

        await config.doInContext(devAppId, () =>
          processMigrations(devAppId, testMigrations)
        )

        expect(executionOrder).toHaveLength(1)
        expect(executionOrder[0]).toBe(devAppId)
        expect(spySyncWorkspace).not.toHaveBeenCalled()
      })
  })

  !fromProd &&
    describe("non-published workspace handling", () => {
      let mockSyncWorkspace: jest.SpyInstance

      beforeEach(async () => {
        mockSyncWorkspace = jest.spyOn(sdk.workspaces, "syncWorkspace")
        await config.unpublish()
      })

      it("should sync only dev workspace", async () => {
        const executionOrder: string[] = []
        const testMigrations = Array.from({
          length: 3,
        }).map<WorkspaceMigration>((_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`migration ${i + 1} - ${db.name}`)
          },
        }))

        const workspaceId = config.getDevWorkspaceId()
        await config.doInContext(workspaceId, async () => {
          await updateWorkspaceMigrationMetadata({
            workspaceId,
            version: testMigrations[0].id,
          })
        })

        mockSyncWorkspace.mockClear()

        await runMigrations(testMigrations)

        expect(executionOrder).toEqual([
          `migration 2 - ${config.getDevWorkspaceId()}`,
          `migration 3 - ${config.getDevWorkspaceId()}`,
        ])
        expect(mockSyncWorkspace).not.toHaveBeenCalled()
      })
    })

  describe("resilience and recovery", () => {
    it("should not update migration version if migration function fails", async () => {
      const testMigrations: WorkspaceMigration[] = [
        {
          id: generateMigrationId(),
          func: jest
            .fn()
            .mockImplementationOnce(() => {
              const db = context.getWorkspaceDB()
              expect(db.name).toBe(config.getProdWorkspaceId())
            })
            .mockImplementationOnce(() => {
              const db = context.getWorkspaceDB()
              expect(db.name).toBe(config.getDevWorkspaceId())
              throw new Error("Migration failed")
            }),
        },
      ]

      // Get the initial migration version
      const initialVersion = MIGRATIONS[MIGRATIONS.length - 1].id
      await expectMigrationVersion(initialVersion)

      // Run migrations and expect failure
      await expect(runMigrations(testMigrations)).rejects.toThrow(
        "Migration failed"
      )

      // Verify that migration version wasn't updated to the failing migration
      await expectMigrationVersion(initialVersion)
      expect(testMigrations[0].func).toHaveBeenCalledTimes(2)
    })

    it("should recover if migration function runs on prod but fails in dev", async () => {
      const testMigrations: WorkspaceMigration[] = [
        {
          id: generateMigrationId(),
          func: jest
            .fn()
            .mockImplementationOnce(() => {
              const db = context.getWorkspaceDB()
              expect(db.name).toBe(config.getProdWorkspaceId())
            })
            .mockImplementationOnce(() => {
              const db = context.getWorkspaceDB()
              expect(db.name).toBe(config.getDevWorkspaceId())
              throw new Error("Migration failed")
            }),
        },
      ]

      // Get the initial migration version
      const initialVersion = MIGRATIONS[MIGRATIONS.length - 1].id
      await expectMigrationVersion(initialVersion)

      // Run migrations and expect failure
      await expect(runMigrations(testMigrations)).rejects.toThrow(
        "Migration failed"
      )

      await runMigrations(testMigrations)

      await expectMigrationVersion(testMigrations[0].id)
      expect(testMigrations[0].func).toHaveBeenCalledTimes(4)
    })

    it("should allow recovery by rerunning from failing point after error", async () => {
      const executionOrder: string[] = []
      const attemptCount: Record<string, number> = {}

      const migration1Id = generateMigrationId()
      const migration2Id = generateMigrationId()

      const testMigrations: WorkspaceMigration[] = [
        {
          id: migration1Id,
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name}-migration-1`)
          },
        },
        {
          id: migration2Id,
          func: async () => {
            const db = context.getWorkspaceDB()
            attemptCount[db.name] ??= 0
            attemptCount[db.name]++
            if (
              db.name === config.getDevWorkspaceId() &&
              attemptCount[db.name] === 1
            ) {
              executionOrder.push(
                `${db.name}-migration-2-attempt-${attemptCount[db.name]}-error`
              )
              // Fail on first attempt
              throw new Error("Migration failed on first attempt")
            }
            executionOrder.push(
              `${db.name}-migration-2-attempt-${attemptCount[db.name]}-success`
            )
            // Succeed on subsequent attempts
          },
        },
      ]

      // First run should fail on migration 2, but migration 1 should complete
      await expect(runMigrations(testMigrations)).rejects.toThrow(
        "Migration failed on first attempt"
      )
      await expectMigrationVersion(migration1Id)

      // Second run should succeed (migration-2 will succeed this time)
      await runMigrations(testMigrations)
      await expectMigrationVersion(migration2Id)

      // Verify that migration 1 ran only once per app and migration 2 ran twice
      const migration1Runs = executionOrder.filter(e =>
        e.includes("migration-1")
      )
      const migration2Runs = executionOrder.filter(e =>
        e.includes("migration-2")
      )

      expect(migration1Runs).toEqual([
        `${config.getProdWorkspaceId()}-migration-1`,
        `${config.getDevWorkspaceId()}-migration-1`,
      ])

      expect(migration2Runs).toEqual([
        `${config.getProdWorkspaceId()}-migration-2-attempt-1-success`,
        `${config.getDevWorkspaceId()}-migration-2-attempt-1-error`,
        `${config.getProdWorkspaceId()}-migration-2-attempt-2-success`,
        `${config.getDevWorkspaceId()}-migration-2-attempt-2-success`,
      ])
    })
  })

  describe("out-of-sync migration handling", () => {
    it("should handle dev migration version ahead of prod", async () => {
      const executionOrder: string[] = []
      const testMigrations = Array.from({ length: 3 }).map<WorkspaceMigration>(
        (_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - migration-${i + 1}`)
          },
        })
      )

      const prodAppId = config.getProdWorkspaceId()
      const devAppId = config.getDevWorkspaceId()

      await config.doInContext(prodAppId, async () => {
        await updateWorkspaceMigrationMetadata({
          workspaceId: prodAppId,
          version: testMigrations[0].id,
        })
      })

      await config.doInContext(devAppId, async () => {
        await updateWorkspaceMigrationMetadata({
          workspaceId: devAppId,
          version: testMigrations[1].id,
        })
      })

      await runMigrations(testMigrations)

      expect(executionOrder).toEqual([
        `${prodAppId} - migration-2`,
        `${prodAppId} - migration-3`,
        `${devAppId} - migration-3`,
      ])

      // Both apps should end up on the latest migration
      for (const appId of [devAppId, prodAppId]) {
        expect(
          await config.doInContext(appId, () =>
            getWorkspaceMigrationVerions(appId)
          )
        ).toBe(testMigrations[2].id)
      }
    })

    it("should handle prod migration version ahead of dev", async () => {
      const executionOrder: string[] = []
      const testMigrations = Array.from({ length: 4 }).map<WorkspaceMigration>(
        (_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - migration-${i + 1}`)
          },
        })
      )

      const prodAppId = config.getProdWorkspaceId()
      const devAppId = config.getDevWorkspaceId()

      await config.doInContext(devAppId, async () => {
        await updateWorkspaceMigrationMetadata({
          workspaceId: devAppId,
          version: testMigrations[0].id,
        })
      })

      await config.doInContext(prodAppId, async () => {
        await updateWorkspaceMigrationMetadata({
          workspaceId: prodAppId,
          version: testMigrations[2].id,
        })
      })

      await runMigrations(testMigrations)

      expect(executionOrder).toEqual([
        `${devAppId} - migration-2`,
        `${devAppId} - migration-3`,
        `${prodAppId} - migration-4`,
        `${devAppId} - migration-4`,
      ])

      // Both apps should end up on the latest migration
      for (const appId of [devAppId, prodAppId]) {
        expect(
          await config.doInContext(appId, () =>
            getWorkspaceMigrationVerions(appId)
          )
        ).toBe(testMigrations[testMigrations.length - 1].id)
      }
    })

    it("should only run migrations needed by each workspace individually", async () => {
      const executionOrder: string[] = []
      const testMigrations = Array.from({ length: 2 }).map<WorkspaceMigration>(
        (_, i) => ({
          id: generateMigrationId(),
          func: async () => {
            const db = context.getWorkspaceDB()
            executionOrder.push(`${db.name} - migration-${i + 1}`)
          },
        })
      )
      const prodAppId = config.getProdWorkspaceId()
      const devAppId = config.getDevWorkspaceId()

      // Set dev app to already be on the latest migration, prod app needs both
      await config.doInContext(devAppId, async () => {
        await updateWorkspaceMigrationMetadata({
          workspaceId: devAppId,
          version: testMigrations[1].id,
        })
      })

      await runMigrations(testMigrations)

      // Only prod should run migrations since dev is already up-to-date
      expect(executionOrder).toEqual([
        `${prodAppId} - migration-1`,
        `${prodAppId} - migration-2`,
      ])

      // Both apps should be on the latest migration
      for (const appId of [devAppId, prodAppId]) {
        expect(
          await config.doInContext(appId, () =>
            getWorkspaceMigrationVerions(appId)
          )
        ).toBe(testMigrations[1].id)
      }
    })
  })

  describe("via middleware", () => {
    it("should properly handle syncWorkspace context when triggered via API", async () => {
      await expectMigrationVersion(MIGRATIONS[MIGRATIONS.length - 1].id)

      const executionOrder: string[] = []
      MIGRATIONS.push({
        id: generateMigrationId(),
        func: async () => {
          const db = context.getWorkspaceDB()
          executionOrder.push(`${db.name}-via-middleware`)
        },
      })

      // Any random API call to trigger the middleware
      await withEnv(
        {
          SYNC_MIGRATION_CHECKS_MS: 1000,
        },
        () =>
          config.withApp(
            fromProd ? config.getProdWorkspace() : config.getDevWorkspace(),
            () =>
              config.api.user.fetch({
                headersNotPresent: [Header.MIGRATING_APP],
              })
          )
      )

      expect(executionOrder).toEqual([
        `${config.getProdWorkspaceId()}-via-middleware`,
        `${config.getDevWorkspaceId()}-via-middleware`,
      ])
    })
  })
})
