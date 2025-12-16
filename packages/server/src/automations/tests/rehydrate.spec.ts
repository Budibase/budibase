import "@budibase/backend-core/tests"
import { GenericContainer, StartedTestContainer } from "testcontainers"

jest.setTimeout(60_000)

describe("rehydrateScheduledTriggers (integration)", () => {
  let redis: StartedTestContainer | undefined

  let TestConfiguration: typeof import("../../tests/utilities/TestConfiguration").default
  let createAutomationBuilder: typeof import("./utilities/AutomationTestBuilder").createAutomationBuilder
  let rehydrateScheduledTriggers: typeof import("../rehydrate").rehydrateScheduledTriggers
  let automationQueue: typeof import("../bullboard").automationQueue
  let disableAllCrons: typeof import("../utils").disableAllCrons
  let env: typeof import("../../environment").default
  let coreQueue: typeof import("@budibase/backend-core").queue

  const originalEnv = {
    BULL_TEST_REDIS_PORT: process.env.BULL_TEST_REDIS_PORT,
    MULTI_TENANCY: process.env.MULTI_TENANCY,
    SELF_HOSTED: process.env.SELF_HOSTED,
    FORKED_PROCESS: process.env.FORKED_PROCESS,
  }

  beforeAll(async () => {
    redis = await new GenericContainer("redis").withExposedPorts(6379).start()

    process.env.BULL_TEST_REDIS_PORT = `${redis.getMappedPort(6379)}`
    delete process.env.FORKED_PROCESS
    ;({ default: TestConfiguration } = await import(
      "../../tests/utilities/TestConfiguration"
    ))
    ;({ createAutomationBuilder } = await import(
      "./utilities/AutomationTestBuilder"
    ))
    ;({ rehydrateScheduledTriggers } = await import("../rehydrate"))
    ;({ automationQueue } = await import("../bullboard"))
    ;({ disableAllCrons } = await import("../utils"))
    ;({ default: env } = await import("../../environment"))
    ;({ queue: coreQueue } = await import("@budibase/backend-core"))
  })

  afterAll(async () => {
    // Close Bull queues while Redis is still running to avoid connection errors.
    if (coreQueue) {
      await coreQueue.shutdown()
    }
    if (redis) {
      await redis.stop()
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value == null) {
        delete (process.env as any)[key]
      } else {
        ;(process.env as any)[key] = value
      }
    }
    if (env) {
      env._set("SELF_HOSTED", originalEnv.SELF_HOSTED || "1")
      env._set("MULTI_TENANCY", originalEnv.MULTI_TENANCY || "1")
    }
  })

  it("rehydrates cron triggers when repeatable jobs are missing", async () => {
    const config = new TestConfiguration()
    try {
      await config.init()

      env._set("SELF_HOSTED", "1")
      env._set("MULTI_TENANCY", 0)
      delete process.env.FORKED_PROCESS

      const prodId = config.getProdWorkspaceId()

      await createAutomationBuilder(config)
        .onCron({ cron: "* * * * *" })
        .serverLog({ text: "Hello, world!" })
        .save()

      await config.api.workspace.publish()

      const queue = automationQueue.getBullQueue()
      const initialRepeatables = await queue.getRepeatableJobs()
      expect(
        initialRepeatables.some(
          job =>
            job.id?.toString().startsWith(`${prodId}_cron_`) &&
            job.cron === "* * * * *"
        )
      ).toEqual(true)

      await disableAllCrons(prodId)
      const clearedRepeatables = await queue.getRepeatableJobs()
      expect(
        clearedRepeatables.some(job =>
          job.id?.toString().startsWith(`${prodId}_cron_`)
        )
      ).toEqual(false)

      await config.doInTenant(async () => {
        await rehydrateScheduledTriggers()
      })

      const rehydratedRepeatables = await queue.getRepeatableJobs()
      expect(
        rehydratedRepeatables.some(
          job =>
            job.id?.toString().startsWith(`${prodId}_cron_`) &&
            job.cron === "* * * * *"
        )
      ).toEqual(true)
    } finally {
      config.end()
    }
  })
})
