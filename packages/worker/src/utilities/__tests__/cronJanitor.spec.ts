import type { CronJanitorDeps } from "../cronJanitor"
import { runAutomationCronJanitor } from "../cronJanitor"

type FakeJob = {
  id?: string
  key: string
}

const jobKey = (jobId: string) => `__default__:${jobId}:::* * * * *`

const createJob = (jobId: string, includeId = true): FakeJob => ({
  id: includeId ? jobId : undefined,
  key: jobKey(jobId),
})

const getJobId = (job: FakeJob) => job.id ?? job.key.split(":")[1]

describe("runAutomationCronJanitor", () => {
  it("removes jobs whose workspace database no longer exists", async () => {
    const removed: string[] = []
    const deps: CronJanitorDeps = {
      listRepeatableJobs: async () => [
        createJob("app_prod_cron_a"),
        createJob("ghost_email_b"),
      ],
      removeRepeatableJob: async job => {
        removed.push(getJobId(job))
      },
      workspaceExists: async () => false,
      fetchWorkspaceJobIds: async () => new Set(),
    }

    const count = await runAutomationCronJanitor(deps)
    expect(count).toEqual(2)
    expect(removed).toEqual(["app_prod_cron_a", "ghost_email_b"])
  })

  it("keeps jobs that still belong to existing automations", async () => {
    const removed: string[] = []
    const deps: CronJanitorDeps = {
      listRepeatableJobs: async () => [
        createJob("app_prod_cron_keep"),
        createJob("app_prod_cron_remove"),
      ],
      removeRepeatableJob: async job => {
        removed.push(getJobId(job))
      },
      workspaceExists: async workspaceId => workspaceId === "app_prod",
      fetchWorkspaceJobIds: async workspaceId => {
        if (workspaceId === "app_prod") {
          return new Set(["app_prod_cron_keep"])
        }
        return new Set()
      },
    }

    const count = await runAutomationCronJanitor(deps)
    expect(count).toEqual(1)
    expect(removed).toEqual(["app_prod_cron_remove"])
  })

  it("parses job ids from the key when Bull omits them", async () => {
    const removed: string[] = []
    const deps: CronJanitorDeps = {
      listRepeatableJobs: async () => [
        createJob("app_prod_email_one", false),
      ],
      removeRepeatableJob: async job => {
        removed.push(getJobId(job))
      },
      workspaceExists: async () => false,
      fetchWorkspaceJobIds: async () => new Set(),
    }

    const count = await runAutomationCronJanitor(deps)
    expect(count).toEqual(1)
    expect(removed).toEqual(["app_prod_email_one"])
  })

  it("ignores repeatable jobs that do not follow the automation naming convention", async () => {
    const deps: CronJanitorDeps = {
      listRepeatableJobs: async () => [createJob("system_job")],
      removeRepeatableJob: async () => {
        throw new Error("should not remove")
      },
      workspaceExists: async () => true,
      fetchWorkspaceJobIds: async () => new Set(),
    }

    const count = await runAutomationCronJanitor(deps)
    expect(count).toEqual(0)
  })
})
