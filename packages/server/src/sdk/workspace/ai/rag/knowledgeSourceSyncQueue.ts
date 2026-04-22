import type { Job } from "bull"
import { context, db, docIds, queue, utils } from "@budibase/backend-core"
import {
  AgentKnowledgeSourceType,
  DocumentType,
  type Agent,
} from "@budibase/types"
import env from "../../../../environment"
import { deleteFileForAgent } from "./files"
import {
  deleteKnowledgeSourceSyncStateForAgent,
  deleteSharePointFilesForAgentSite,
  syncSharePointSourcesForAgent,
} from "./sharepoint"

const DEFAULT_CONCURRENCY = 2
const DEFAULT_BACKOFF_MS = utils.Duration.fromSeconds(10).toMs()
const DEFAULT_TIMEOUT_MS = utils.Duration.fromMinutes(15).toMs()

const getScheduleWorkspaceNamespace = (workspaceId: string) =>
  db.getProdWorkspaceID(workspaceId)

interface BaseKnowledgeSourceJob {
  workspaceId: string
  agentId: string
}

export interface KnowledgeSourceSyncJob extends BaseKnowledgeSourceJob {
  jobType: "sync"
  sourceType: AgentKnowledgeSourceType
  sourceId: string
}

interface KnowledgeBaseFileDeleteJob extends BaseKnowledgeSourceJob {
  jobType: "delete_file"
  fileId: string
}

interface SharePointSiteDisconnectJob extends BaseKnowledgeSourceJob {
  jobType: "disconnect_sharepoint_site"
  siteId: string
}

export type KnowledgeSourceJob =
  | KnowledgeSourceSyncJob
  | KnowledgeBaseFileDeleteJob
  | SharePointSiteDisconnectJob

interface ReconcileAgentJobsSummary {
  clearedSchedules: number
  enabledSchedules: number
}

let knowledgeSourceSyncQueue:
  | queue.BudibaseQueue<KnowledgeSourceJob>
  | undefined
let knowledgeSourceSyncQueueInitialised = false

const getAgentJobPrefix = (workspaceId: string, agentId: string) =>
  `${getScheduleWorkspaceNamespace(workspaceId)}_knowledge_source_sync_${agentId}_`

const getJobId = (job: KnowledgeSourceSyncJob) =>
  `${getAgentJobPrefix(job.workspaceId, job.agentId)}${job.sourceType}_${job.sourceId}`

const getAgentSharePointSources = (agent: Agent) =>
  (agent.knowledgeSources || []).filter(
    source => source.type === AgentKnowledgeSourceType.SHAREPOINT
  )

const hasSchedulableSharePointSource = (agent: Agent) => {
  return getAgentSharePointSources(agent).some(
    source => !!source.id?.trim() && !!source.config.site?.id?.trim()
  )
}

const getDesiredJobsForAgent = (
  workspaceId: string,
  agent: Agent
): KnowledgeSourceSyncJob[] => {
  if (!agent._id || !hasSchedulableSharePointSource(agent)) {
    return []
  }
  const sourceIds = Array.from(
    new Set(
      getAgentSharePointSources(agent)
        .map(source => source.id?.trim())
        .filter((sourceId): sourceId is string => !!sourceId)
    )
  )
  return sourceIds.map(sourceId => ({
    workspaceId,
    agentId: agent._id!,
    jobType: "sync" as const,
    sourceType: AgentKnowledgeSourceType.SHAREPOINT,
    sourceId,
  }))
}

export function getQueue() {
  if (!knowledgeSourceSyncQueue) {
    knowledgeSourceSyncQueue = new queue.BudibaseQueue<KnowledgeSourceJob>(
      queue.JobQueue.KNOWLEDGE_SOURCE_SYNC,
      {
        maxStalledCount: 3,
        jobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: DEFAULT_BACKOFF_MS,
          },
          timeout: DEFAULT_TIMEOUT_MS,
          removeOnComplete: true,
          removeOnFail: 1000,
        },
        jobTags: data => ({
          workspaceId: data.workspaceId,
          agentId: data.agentId,
          sourceType: data.jobType === "sync" ? data.sourceType : data.jobType,
          sourceId:
            data.jobType === "sync"
              ? data.sourceId
              : data.jobType === "delete_file"
                ? data.fileId
                : data.siteId,
        }),
      }
    )
  }

  return knowledgeSourceSyncQueue
}

export function init(concurrency = DEFAULT_CONCURRENCY) {
  if (knowledgeSourceSyncQueueInitialised) {
    return Promise.resolve()
  }
  try {
    knowledgeSourceSyncQueueInitialised = true
    return getQueue().process(
      concurrency,
      async (job: Job<KnowledgeSourceJob>) => {
        const { workspaceId, agentId } = job.data
        console.log("Processing knowledge source sync queue job", {
          workspaceId,
          agentId,
          jobType: job.data.jobType,
          sourceType:
            "sourceType" in job.data ? job.data.sourceType : undefined,
          sourceId: "sourceId" in job.data ? job.data.sourceId : undefined,
          fileId: "fileId" in job.data ? job.data.fileId : undefined,
          siteId: "siteId" in job.data ? job.data.siteId : undefined,
          jobId: job.id,
        })
        await context.doInWorkspaceContext(workspaceId, async () => {
          switch (job.data.jobType) {
            case "sync":
              switch (job.data.sourceType) {
                case AgentKnowledgeSourceType.SHAREPOINT:
                  await syncSharePointSourcesForAgent(
                    agentId,
                    job.data.sourceId
                  )
                  break
                default:
                  throw new Error(
                    `Unsupported knowledge source type for sync queue: ${job.data.sourceType}`
                  )
              }
              break
            case "delete_file":
              await deleteFileForAgent(agentId, job.data.fileId)
              break
            case "disconnect_sharepoint_site":
              await deleteSharePointFilesForAgentSite(agentId, job.data.siteId)
              await deleteKnowledgeSourceSyncStateForAgent(
                agentId,
                job.data.siteId
              )
              break
            default:
              throw new Error("Unsupported knowledge source queue job type")
          }
        })
        console.log("Completed knowledge source sync queue job", {
          workspaceId,
          agentId,
          jobType: job.data.jobType,
          jobId: job.id,
        })
      }
    )
  } catch (error) {
    console.error("Error initialising SharePoint sync queue", error)
    knowledgeSourceSyncQueueInitialised = false
    return Promise.resolve()
  }
}

export async function scheduleJob(job: KnowledgeSourceSyncJob) {
  init()
  const jobId = getJobId(job)
  return await getQueue().add(job, {
    repeat: {
      every: env.SHAREPOINT_SYNC_INTERVAL_MS,
    },
    jobId,
  })
}

export async function enqueueJob(job: KnowledgeSourceJob) {
  init()
  return await getQueue().add(job)
}

export async function enqueueDeleteFileJob(agentId: string, fileId: string) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId || !agentId || !fileId) {
    return
  }
  await enqueueJob({
    workspaceId,
    agentId,
    jobType: "delete_file",
    fileId,
  })
}

export async function enqueueDisconnectSharePointSiteJob(
  agentId: string,
  siteId: string
) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId || !agentId || !siteId) {
    return
  }
  await enqueueJob({
    workspaceId,
    agentId,
    jobType: "disconnect_sharepoint_site",
    siteId,
  })
}

export async function enqueueAgentJobs(
  agentId: string,
  sourceType: AgentKnowledgeSourceType,
  sourceIds: string[]
) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId || !agentId || sourceIds.length === 0) {
    return
  }
  await Promise.all(
    sourceIds.map(sourceId => {
      const job: KnowledgeSourceSyncJob = {
        workspaceId,
        agentId,
        jobType: "sync",
        sourceType,
        sourceId,
      }
      return getQueue().add(job, {
        jobId: getJobId(job),
      })
    })
  )
}

export async function removeJob(job: KnowledgeSourceSyncJob) {
  const jobId = getJobId(job)
  const bullQueue = getQueue().getBullQueue()
  const repeatableJobs = await bullQueue.getRepeatableJobs()
  const matchingJobs = repeatableJobs.filter(
    repeatable => repeatable.id === jobId
  )
  await Promise.all(
    matchingJobs.flatMap(repeatable => {
      const tasks: Promise<any>[] = [
        bullQueue.removeRepeatableByKey(repeatable.key),
      ]
      if (repeatable.id) {
        tasks.push(bullQueue.removeJobs(repeatable.id))
      }
      return tasks
    })
  )
}

export async function removeAllAgentJobs(agentId: string) {
  const resolvedWorkspaceId = context.getWorkspaceId()
  if (!resolvedWorkspaceId) {
    return
  }
  const prefix = getAgentJobPrefix(resolvedWorkspaceId, agentId)
  const bullQueue = getQueue().getBullQueue()
  const repeatableJobs = await bullQueue.getRepeatableJobs()
  const matchingJobs = repeatableJobs.filter(
    repeatable => repeatable.id && repeatable.id.startsWith(prefix)
  )
  await Promise.all(
    matchingJobs.flatMap(repeatable => {
      const tasks: Promise<any>[] = [
        bullQueue.removeRepeatableByKey(repeatable.key),
      ]
      if (repeatable.id) {
        tasks.push(bullQueue.removeJobs(repeatable.id))
      }
      return tasks
    })
  )
}

export async function reconcileAgentJobs(
  agent: Agent,
  workspaceId?: string
): Promise<ReconcileAgentJobsSummary> {
  if (!agent._id) {
    return {
      clearedSchedules: 0,
      enabledSchedules: 0,
    }
  }
  const resolvedWorkspaceId = workspaceId || context.getWorkspaceId()
  if (!resolvedWorkspaceId) {
    return {
      clearedSchedules: 0,
      enabledSchedules: 0,
    }
  }
  const desiredJobs = getDesiredJobsForAgent(resolvedWorkspaceId, agent)
  const desiredIds = new Set(desiredJobs.map(getJobId))

  const prefix = getAgentJobPrefix(resolvedWorkspaceId, agent._id)
  const bullQueue = getQueue().getBullQueue()
  const repeatableJobs = await bullQueue.getRepeatableJobs()
  const existingAgentJobs = repeatableJobs.filter(
    repeatable => repeatable.id && repeatable.id.startsWith(prefix)
  )
  const staleAgentJobs = existingAgentJobs.filter(
    repeatable => !desiredIds.has(repeatable.id!)
  )

  await Promise.all(
    staleAgentJobs.flatMap(repeatable => {
      const tasks: Promise<any>[] = [
        bullQueue.removeRepeatableByKey(repeatable.key),
      ]
      if (repeatable.id) {
        tasks.push(bullQueue.removeJobs(repeatable.id))
      }
      return tasks
    })
  )

  const existingIds = new Set(existingAgentJobs.map(job => job.id))
  const jobsToEnable = desiredJobs.filter(
    job => !existingIds.has(getJobId(job))
  )
  await Promise.all(jobsToEnable.map(job => scheduleJob(job)))

  return {
    clearedSchedules: staleAgentJobs.length,
    enabledSchedules: jobsToEnable.length,
  }
}

export async function rehydrateScheduledJobs() {
  if (env.isInThread() || !env.SELF_HOSTED || env.MULTI_TENANCY) {
    return
  }

  const workspaceIds = await db.getAllWorkspaces({
    dev: false,
    idsOnly: true,
  })

  const bullQueue = getQueue().getBullQueue()
  let workspaceCount = 0
  let reconciledAgents = 0
  let desiredSchedules = 0
  let staleRepeatablesRemoved = 0
  let staleQueuedJobsRemoved = 0
  let clearedSchedules = 0
  let enabledSchedules = 0

  for (const workspaceId of workspaceIds) {
    await context.doInWorkspaceContext(workspaceId, async () => {
      workspaceCount++
      const workspaceDb = context.getWorkspaceDB()
      const result = await workspaceDb.allDocs<Agent>(
        docIds.getDocParams(DocumentType.AGENT, undefined, {
          include_docs: true,
        })
      )
      const agents = result.rows
        .map(row => row.doc)
        .filter((agent): agent is Agent => !!agent)
      const desiredJobs = agents.flatMap(agent =>
        getDesiredJobsForAgent(workspaceId, agent)
      )
      const desiredIds = new Set(desiredJobs.map(getJobId))
      const repeatableJobs = await bullQueue.getRepeatableJobs()
      const workspacePrefix = `${getScheduleWorkspaceNamespace(workspaceId)}_knowledge_source_sync_`
      const staleWorkspaceJobs = repeatableJobs.filter(
        repeatable =>
          repeatable.id &&
          repeatable.id.startsWith(workspacePrefix) &&
          !desiredIds.has(repeatable.id)
      )

      await Promise.all(
        staleWorkspaceJobs.flatMap(repeatable => {
          const tasks: Promise<any>[] = [
            bullQueue.removeRepeatableByKey(repeatable.key),
          ]
          if (repeatable.id) {
            tasks.push(bullQueue.removeJobs(repeatable.id))
          }
          return tasks
        })
      )
      staleRepeatablesRemoved += staleWorkspaceJobs.length
      staleQueuedJobsRemoved += staleWorkspaceJobs.filter(
        repeatable => !!repeatable.id
      ).length

      const reconcileTargets = agents.filter(agent =>
        (agent.knowledgeSources || []).some(
          source => source.type === AgentKnowledgeSourceType.SHAREPOINT
        )
      )
      const reconcileResults = await Promise.all(
        reconcileTargets.map(agent => reconcileAgentJobs(agent, workspaceId))
      )
      reconciledAgents += reconcileTargets.length
      desiredSchedules += desiredJobs.length
      clearedSchedules += reconcileResults.reduce(
        (total, summary) => total + summary.clearedSchedules,
        0
      )
      enabledSchedules += reconcileResults.reduce(
        (total, summary) => total + summary.enabledSchedules,
        0
      )
    })
  }

  console.log("Knowledge source sync rehydration summary", {
    workspaceCount,
    reconciledAgents,
    desiredSchedules,
    staleRepeatablesRemoved,
    staleQueuedJobsRemoved,
    clearedSchedules,
    enabledSchedules,
  })
}
