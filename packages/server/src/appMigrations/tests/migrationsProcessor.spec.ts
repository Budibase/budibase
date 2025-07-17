import * as setup from "../../api/routes/tests/utilities"
import { processMigrations } from "../migrationsProcessor"
import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "../appMigrationMetadata"
import { context, Duration, Header } from "@budibase/backend-core"
import { AppMigration } from ".."
import { generator, structures } from "@budibase/backend-core/tests"
import sdk from "../../sdk"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { MIGRATIONS } from "../migrations"
import { withEnv } from "../../environment"

let latestMigrationTime = new Date()

const latestMigrationTimestamp = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

function generateNextMigrationId() {
  latestMigrationTime = structures.generator.date({
    min: latestMigrationTime,
    max: new Date(latestMigrationTime.getTime() + Duration.fromDays(1).toMs()),
    string: false,
  }) as Date
  return `${latestMigrationTimestamp(latestMigrationTime)}_${generator.guid()}`
}

describe.each([true, false])("migrationsProcessor", fromProd => {
  let config: TestConfiguration

  beforeAll(async () => {
    config = setup.getConfig()
    await config.init()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await config.newTenant()
  })

  async function runMigrations(migrations: AppMigration[]) {
    const fromAppId = fromProd ? config.getProdAppId() : config.getAppId()
    await config.doInContext(fromAppId, () =>
      processMigrations(fromAppId, migrations)
    )
  }

  async function expectMigrationVersion(expectedVersion: string) {
    for (const appId of [config.getAppId(), config.getProdAppId()]) {
      expect(
        await config.doInContext(appId, () => getAppMigrationVersion(appId))
      ).toBe(expectedVersion)
    }
  }

  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: AppMigration[] = [
      { id: generateNextMigrationId(), func: async () => {} },
      { id: generateNextMigrationId(), func: async () => {} },
      { id: generateNextMigrationId(), func: async () => {} },
    ]

    await runMigrations(testMigrations)

    await expectMigrationVersion(testMigrations[2].id)
  })

  it("syncs the dev app before applying each migration", async () => {
    const executionOrder: string[] = []
    let syncCallCount = 0

    jest.spyOn(sdk.applications, "syncApp").mockImplementation(async () => {
      syncCallCount++
      executionOrder.push(`sync-${syncCallCount}`)
      return undefined as any
    })

    const testMigrations: AppMigration[] = [
      {
        id: generateNextMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name}-migration-1`)
        },
      },
      {
        id: generateNextMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name}-migration-2`)
        },
      },
      {
        id: generateNextMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name}-migration-3`)
        },
      },
    ]

    await runMigrations(testMigrations)

    await expectMigrationVersion(testMigrations[2].id)

    expect(executionOrder).toEqual([
      `${config.getProdAppId()}-migration-1`,
      "sync-1",
      `${config.getAppId()}-migration-1`,
      `${config.getProdAppId()}-migration-2`,
      "sync-2",
      `${config.getAppId()}-migration-2`,
      `${config.getProdAppId()}-migration-3`,
      "sync-3",
      `${config.getAppId()}-migration-3`,
    ])
  })

  it("runs all the migrations in doInAppMigrationContext", async () => {
    let migrationCallPerApp: Record<string, number> = {}
    const testMigrations: AppMigration[] = [
      {
        id: generateNextMigrationId(),
        func: async () => {
          expect(context.getCurrentContext()?.isMigrating).toBe(true)
          migrationCallPerApp[context.getAppId()!] ??= 0
          migrationCallPerApp[context.getAppId()!]++
        },
      },
      {
        id: generateNextMigrationId(),
        func: async () => {
          expect(context.getCurrentContext()?.isMigrating).toBe(true)
          migrationCallPerApp[context.getAppId()!] ??= 0
          migrationCallPerApp[context.getAppId()!]++
        },
      },
      {
        id: generateNextMigrationId(),
        func: async () => {
          expect(context.getCurrentContext()?.isMigrating).toBe(true)
          migrationCallPerApp[context.getAppId()!] ??= 0
          migrationCallPerApp[context.getAppId()!]++
        },
      },
    ]

    await runMigrations(testMigrations)

    expect(Object.keys(migrationCallPerApp)).toEqual([
      config.getProdAppId(),
      config.getAppId(),
    ])
    expect(migrationCallPerApp[config.getAppId()]).toBe(3)
    expect(migrationCallPerApp[config.getProdAppId()]).toBe(3)
  })

  it("no context can be initialised within a migration", async () => {
    const testMigrations: AppMigration[] = [
      {
        id: generateNextMigrationId(),
        func: async () => {
          await context.doInAppMigrationContext(config.getAppId(), () => {})
        },
      },
    ]

    await expect(runMigrations(testMigrations)).rejects.toThrow(
      "The context cannot be changed, a migration is currently running"
    )
  })

  describe("timestamp migration processing", () => {
    it("should run migrations in correct order based on timestamp", async () => {
      const executionOrder: string[] = []
      const [migration1, migration2, migration3] = Array.from({
        length: 3,
      }).map((_, i) => ({
        id: generateNextMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name} - ${i + 1}`)
        },
      }))
      const testMigrations: AppMigration[] = [
        migration1,
        migration3,
        migration2,
      ]

      await runMigrations(testMigrations)

      expect(executionOrder).toEqual([
        `${config.getProdAppId()} - 1`,
        `${config.getAppId()} - 1`,
        `${config.getProdAppId()} - 2`,
        `${config.getAppId()} - 2`,
        `${config.getProdAppId()} - 3`,
        `${config.getAppId()} - 3`,
      ])
    })

    it("should skip migrations that come before current version in array", async () => {
      const executionOrder: string[] = []
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: async () => {
            throw "This should not be call"
          },
        },
        {
          id: generateNextMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 2`)
          },
        },
        {
          id: generateNextMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 3`)
          },
        },
      ]

      const prodAppId = config.getProdAppId()
      await config.doInContext(prodAppId, async () => {
        await updateAppMigrationMetadata({
          appId: prodAppId,
          version: testMigrations[0].id,
        })
      })

      await runMigrations(testMigrations)

      expect(executionOrder).toEqual([
        `${config.getProdAppId()} - 2`,
        `${config.getAppId()} - 2`,
        `${config.getProdAppId()} - 3`,
        `${config.getAppId()} - 3`,
      ])
    })

    it("should handle when current version is not found in migrations array", async () => {
      const executionOrder: string[] = []
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 1`)
          },
        },
        {
          id: generateNextMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 2`)
          },
        },
      ]

      const appId = config.getAppId()
      await config.doInContext(appId, async () => {
        // Set a version that doesn't exist in the migrations array
        await updateAppMigrationMetadata({
          appId,
          version: "nonexistent_version",
        })
      })

      await runMigrations(testMigrations)

      // Should run all migrations
      expect(executionOrder).toEqual([
        `${config.getProdAppId()} - 1`,
        `${config.getAppId()} - 1`,
        `${config.getProdAppId()} - 2`,
        `${config.getAppId()} - 2`,
      ])
    })

    it("should not run any migrations when current version is the last in array", async () => {
      const executionOrder: number[] = []
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: async () => {
            executionOrder.push(1)
          },
        },
        {
          id: generateNextMigrationId(),
          func: async () => {
            executionOrder.push(2)
          },
        },
      ]

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
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 1`)
          },
        },
        {
          id: generateNextMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 2`)
          },
          disabled: true,
        },
        {
          id: generateNextMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 3`)
          },
        },
      ]

      await runMigrations(testMigrations)

      // Should only run the first migration, then stop at the disabled one
      expect(executionOrder).toEqual([
        `${config.getProdAppId()} - 1`,
        `${config.getAppId()} - 1`,
      ])
    })

    it("should not run any migrations if the first pending migration is disabled", async () => {
      const executionOrder: number[] = []
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: async () => {
            executionOrder.push(1)
          },
          disabled: true,
        },
        {
          id: generateNextMigrationId(),
          func: async () => {
            executionOrder.push(2)
          },
        },
      ]

      const appId = config.getAppId()

      await config.doInContext(appId, () =>
        processMigrations(appId, testMigrations)
      )

      // Should not run any migrations
      expect(executionOrder).toEqual([])
    })
  })

  describe("published app handling", () => {
    let spySyncApp: jest.SpyInstance

    beforeEach(() => {
      spySyncApp = jest.spyOn(sdk.applications, "syncApp")
    })

    it("should sync dev app after migrating published app", async () => {
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: async () => {
            throw "This should not be call"
          },
        },
        {
          id: generateNextMigrationId(),
          func: async () => {},
        },
        {
          id: generateNextMigrationId(),
          func: async () => {},
        },
      ]

      for (const appId of [config.getAppId(), config.getProdAppId()]) {
        await config.doInContext(appId, async () => {
          await updateAppMigrationMetadata({
            appId,
            version: testMigrations[0].id,
          })
        })
      }
      spySyncApp.mockClear()

      await runMigrations(testMigrations)

      expect(spySyncApp).toHaveBeenCalledTimes(2)
      expect(spySyncApp).toHaveBeenCalledWith(config.getAppId())
    })

    it("should update migration metadata for both prod and dev apps", async () => {
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: async () => {},
        },
      ]

      await expectMigrationVersion(MIGRATIONS[MIGRATIONS.length - 1].id)

      await runMigrations(testMigrations)

      await expectMigrationVersion(testMigrations[0].id)
    })

    !fromProd &&
      it("should migrate dev app when app is not published", async () => {
        const executionOrder: string[] = []
        const testMigrations: AppMigration[] = [
          {
            id: generateNextMigrationId(),
            func: async () => {
              const db = context.getAppDB()
              executionOrder.push(db.name)
            },
          },
        ]

        spySyncApp.mockClear()
        await config.unpublish()

        const devAppId = config.getAppId()

        await config.doInContext(devAppId, () =>
          processMigrations(devAppId, testMigrations)
        )

        expect(executionOrder).toHaveLength(1)
        expect(executionOrder[0]).toBe(devAppId)
        expect(spySyncApp).not.toHaveBeenCalled()
      })
  })

  !fromProd &&
    describe("non-published app handling", () => {
      let mockSyncApp: jest.SpyInstance

      beforeEach(async () => {
        mockSyncApp = jest.spyOn(sdk.applications, "syncApp")
        await config.unpublish()
      })

      it("should sync only dev app", async () => {
        const executionOrder: string[] = []
        const testMigrations: AppMigration[] = [
          {
            id: generateNextMigrationId(),
            func: async () => {
              const db = context.getAppDB()
              executionOrder.push(`migration 1 - ${db.name}`)
            },
          },
          {
            id: generateNextMigrationId(),
            func: async () => {
              const db = context.getAppDB()
              executionOrder.push(`migration 2 - ${db.name}`)
            },
          },
          {
            id: generateNextMigrationId(),
            func: async () => {
              const db = context.getAppDB()
              executionOrder.push(`migration 3 - ${db.name}`)
            },
          },
        ]

        const appId = config.getAppId()
        await config.doInContext(appId, async () => {
          await updateAppMigrationMetadata({
            appId,
            version: testMigrations[0].id,
          })
        })

        mockSyncApp.mockClear()

        await runMigrations(testMigrations)

        expect(executionOrder).toEqual([
          `migration 2 - ${config.getAppId()}`,
          `migration 3 - ${config.getAppId()}`,
        ])
        expect(mockSyncApp).not.toHaveBeenCalled()
      })
    })

  describe("resilience and recovery", () => {
    it("should not update migration version if migration function fails", async () => {
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: jest
            .fn()
            .mockImplementationOnce(() => {
              const db = context.getAppDB()
              expect(db.name).toBe(config.getProdAppId())
            })
            .mockImplementationOnce(() => {
              const db = context.getAppDB()
              expect(db.name).toBe(config.getAppId())
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
      const testMigrations: AppMigration[] = [
        {
          id: generateNextMigrationId(),
          func: jest
            .fn()
            .mockImplementationOnce(() => {
              const db = context.getAppDB()
              expect(db.name).toBe(config.getProdAppId())
            })
            .mockImplementationOnce(() => {
              const db = context.getAppDB()
              expect(db.name).toBe(config.getAppId())
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

      const migration1Id = generateNextMigrationId()
      const migration2Id = generateNextMigrationId()

      const testMigrations: AppMigration[] = [
        {
          id: migration1Id,
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name}-migration-1`)
          },
        },
        {
          id: migration2Id,
          func: async () => {
            const db = context.getAppDB()
            attemptCount[db.name] ??= 0
            attemptCount[db.name]++
            if (db.name === config.getAppId() && attemptCount[db.name] === 1) {
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
        `${config.getProdAppId()}-migration-1`,
        `${config.getAppId()}-migration-1`,
      ])

      expect(migration2Runs).toEqual([
        `${config.getProdAppId()}-migration-2-attempt-1-success`,
        `${config.getAppId()}-migration-2-attempt-1-error`,
        `${config.getProdAppId()}-migration-2-attempt-2-success`,
        `${config.getAppId()}-migration-2-attempt-2-success`,
      ])
    })
  })

  describe("via middleware", () => {
    it("should properly handle syncApp context when triggered via API", async () => {
      await expectMigrationVersion(MIGRATIONS[MIGRATIONS.length - 1].id)

      const executionOrder: string[] = []
      MIGRATIONS.push({
        id: generateNextMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name}-via-middleware`)
        },
      })

      // Any random API call to trigger the middleware
      await withEnv(
        {
          SYNC_MIGRATION_CHECKS_MS: 1000,
        },
        () =>
          config.withApp(fromProd ? config.getProdApp() : config.getApp(), () =>
            config.api.user.fetch({ headersNotPresent: [Header.MIGRATING_APP] })
          )
      )

      expect(executionOrder).toEqual([
        `${config.getProdAppId()}-via-middleware`,
        `${config.getAppId()}-via-middleware`,
      ])
    })
  })
})
