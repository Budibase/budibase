import * as setup from "../../api/routes/tests/utilities"
import { processMigrations } from "../migrationsProcessor"
import {
  getAppMigrationVersion,
  updateAppMigrationMetadata,
} from "../appMigrationMetadata"
import { context } from "@budibase/backend-core"
import { AppMigration } from ".."
import { generator } from "@budibase/backend-core/tests"

function generateMigrationId() {
  return generator.guid()
}

describe("migrationsProcessor", () => {
  it("running migrations will update the latest applied migration", async () => {
    const testMigrations: AppMigration[] = [
      { id: generateMigrationId(), func: async () => {} },
      { id: generateMigrationId(), func: async () => {} },
      { id: generateMigrationId(), func: async () => {} },
    ]

    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    await config.doInContext(appId, () =>
      processMigrations(appId, testMigrations)
    )

    expect(
      await config.doInContext(appId, () => getAppMigrationVersion(appId))
    ).toBe(testMigrations[2].id)
  })

  it("no context can be initialised within a migration", async () => {
    const testMigrations: AppMigration[] = [
      {
        id: generateMigrationId(),
        func: async () => {
          await context.doInAppMigrationContext("any", () => {})
        },
      },
    ]

    const config = setup.getConfig()
    await config.init()

    const appId = config.getAppId()

    await expect(
      config.doInContext(appId, () => processMigrations(appId, testMigrations))
    ).rejects.toThrow(
      "The context cannot be changed, a migration is currently running"
    )
  })

  describe("array index-based migration processing", () => {
    it("should run migrations in correct order based on array position", async () => {
      const executionOrder: number[] = []
      const testMigrations: AppMigration[] = [
        {
          id: `migration_a`,
          func: async () => {
            executionOrder.push(1)
          },
        },
        {
          id: `migration_c`,
          func: async () => {
            executionOrder.push(3)
          },
        },
        {
          id: `migration_b`,
          func: async () => {
            executionOrder.push(2)
          },
        },
      ]

      const config = setup.getConfig()
      const { appId } = await config.init()

      await config.doInContext(appId, () =>
        processMigrations(appId, testMigrations)
      )

      expect(executionOrder).toEqual([1, 3, 2])
    })

    it("should skip migrations that come before current version in array", async () => {
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
        {
          id: generateMigrationId(),
          func: async () => {
            executionOrder.push(3)
          },
        },
      ]

      const config = setup.getConfig()
      const { appId } = await config.init()

      await config.doInContext(appId, async () => {
        await updateAppMigrationMetadata({
          appId,
          version: testMigrations[0].id,
        })

        await processMigrations(appId, testMigrations)
      })

      expect(executionOrder).toEqual([2, 3])
    })

    it("should handle when current version is not found in migrations array", async () => {
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

      const config = setup.getConfig()
      const { appId } = await config.init()

      await config.doInContext(appId, async () => {
        // Set a version that doesn't exist in the migrations array
        await updateAppMigrationMetadata({
          appId,
          version: "nonexistent_version",
        })
        await processMigrations(appId, testMigrations)
      })

      // Should run all migrations
      expect(executionOrder).toEqual([1, 2])
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

      const config = setup.getConfig()
      const { appId } = await config.init()

      await config.doInContext(appId, async () => {
        // Run all migrations first
        await processMigrations(appId, testMigrations)

        // Clear execution order and run again
        executionOrder.length = 0
        await config.doInContext(appId, () =>
          processMigrations(appId, testMigrations)
        )
      })

      // Should not execute any migrations
      expect(executionOrder).toEqual([])
    })
  })

  describe("disabled migrations", () => {
    it("should stop processing when encountering a disabled migration", async () => {
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
          disabled: true,
        },
        {
          id: generateMigrationId(),
          func: async () => {
            executionOrder.push(3)
          },
        },
      ]

      const config = setup.getConfig()
      const { appId } = await config.init()

      await config.doInContext(appId, () =>
        processMigrations(appId, testMigrations)
      )

      // Should only run the first migration, then stop at the disabled one
      expect(executionOrder).toEqual([1])
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

      const config = setup.getConfig()
      const { appId } = await config.init()

      await config.doInContext(appId, () =>
        processMigrations(appId, testMigrations)
      )

      // Should not run any migrations
      expect(executionOrder).toEqual([])
    })
  })
})
