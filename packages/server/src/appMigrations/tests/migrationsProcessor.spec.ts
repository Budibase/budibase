import * as setup from "../../api/routes/tests/utilities"
import { processMigrations } from "../migrationsProcessor"
import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "../appMigrationMetadata"
import { context } from "@budibase/backend-core"
import { AppMigration } from ".."
import { generator } from "@budibase/backend-core/tests"
import sdk from "../../sdk"
import TestConfiguration from "../../tests/utilities/TestConfiguration"

function generateMigrationId() {
  return generator.guid()
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

  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: AppMigration[] = [
      { id: generateMigrationId(), func: async () => {} },
      { id: generateMigrationId(), func: async () => {} },
      { id: generateMigrationId(), func: async () => {} },
    ]

    await runMigrations(testMigrations)

    for (const appId of [config.getAppId(), config.getProdAppId()]) {
      expect(
        await config.doInContext(appId, () => getAppMigrationVersion(appId))
      ).toBe(testMigrations[2].id)
    }
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
        id: generateMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name}-migration-1`)
        },
      },
      {
        id: generateMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name}-migration-2`)
        },
      },
      {
        id: generateMigrationId(),
        func: async () => {
          const db = context.getAppDB()
          executionOrder.push(`${db.name}-migration-3`)
        },
      },
    ]

    await runMigrations(testMigrations)

    for (const appId of [config.getAppId(), config.getProdAppId()]) {
      expect(
        await config.doInContext(appId, () => getAppMigrationVersion(appId))
      ).toBe(testMigrations[2].id)
    }

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

  it("no context can be initialised within a migration", async () => {
    const testMigrations: AppMigration[] = [
      {
        id: generateMigrationId(),
        func: async () => {
          await context.doInAppMigrationContext(config.getAppId(), () => {})
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
      const testMigrations: AppMigration[] = [
        {
          id: `migration_a`,
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 1`)
          },
        },
        {
          id: `migration_c`,
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 3`)
          },
        },
        {
          id: `migration_b`,
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 2`)
          },
        },
      ]

      await runMigrations(testMigrations)

      expect(executionOrder).toEqual([
        `${config.getProdAppId()} - 1`,
        `${config.getAppId()} - 1`,
        `${config.getProdAppId()} - 3`,
        `${config.getAppId()} - 3`,
        `${config.getProdAppId()} - 2`,
        `${config.getAppId()} - 2`,
      ])
    })

    it("should skip migrations that come before current version in array", async () => {
      const executionOrder: string[] = []
      const testMigrations: AppMigration[] = [
        {
          id: generateMigrationId(),
          func: async () => {
            throw "This should not be call"
          },
        },
        {
          id: generateMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 2`)
          },
        },
        {
          id: generateMigrationId(),
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
          id: generateMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 1`)
          },
        },
        {
          id: generateMigrationId(),
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
          id: generateMigrationId(),
          func: async () => {
            executionOrder.push(1)
          },
        },
        {
          id: generateMigrationId(),
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
          id: generateMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 1`)
          },
        },
        {
          id: generateMigrationId(),
          func: async () => {
            const db = context.getAppDB()
            executionOrder.push(`${db.name} - 2`)
          },
          disabled: true,
        },
        {
          id: generateMigrationId(),
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
          id: generateMigrationId(),
          func: async () => {
            executionOrder.push(1)
          },
          disabled: true,
        },
        {
          id: generateMigrationId(),
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
    let mockSyncApp: jest.SpyInstance

    beforeEach(() => {
      mockSyncApp = jest
        .spyOn(sdk.applications, "syncApp")
        .mockResolvedValue(undefined as any)
    })

    afterEach(() => {
      mockSyncApp.mockRestore()
    })

    it("should sync dev app after migrating published app", async () => {
      const testMigrations: AppMigration[] = [
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

      for (const appId of [config.getAppId(), config.getProdAppId()]) {
        await config.doInContext(appId, async () => {
          await updateAppMigrationMetadata({
            appId,
            version: testMigrations[0].id,
          })
        })
      }
      mockSyncApp.mockClear()

      await runMigrations(testMigrations)

      expect(mockSyncApp).toHaveBeenCalledTimes(2)
      expect(mockSyncApp).toHaveBeenCalledWith(config.getAppId())
    })

    it("should update migration metadata for both prod and dev apps", async () => {
      const testMigrations: AppMigration[] = [
        {
          id: generateMigrationId(),
          func: async () => {},
        },
      ]

      const devAppId = config.getAppId()
      const prodAppId = config.getProdAppId()

      for (const appId of [devAppId, prodAppId]) {
        expect(
          await config.doInContext(appId, () => getAppMigrationVersion(appId))
        ).not.toBe(testMigrations[0].id)
      }

      await runMigrations(testMigrations)

      for (const appId of [devAppId, prodAppId]) {
        expect(
          await config.doInContext(appId, () => getAppMigrationVersion(appId))
        ).toBe(testMigrations[0].id)
      }
    })

    !fromProd &&
      it("should migrate dev app when app is not published", async () => {
        const executionOrder: string[] = []
        const testMigrations: AppMigration[] = [
          {
            id: generateMigrationId(),
            func: async () => {
              const db = context.getAppDB()
              executionOrder.push(db.name)
            },
          },
        ]

        mockSyncApp.mockClear()
        await config.unpublish()

        const devAppId = config.getAppId()

        await config.doInContext(devAppId, () =>
          processMigrations(devAppId, testMigrations)
        )

        expect(executionOrder).toHaveLength(1)
        expect(executionOrder[0]).toBe(devAppId)
        expect(mockSyncApp).not.toHaveBeenCalled()
      })
  })
})
