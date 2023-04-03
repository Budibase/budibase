import { createQueue, JobQueue } from "../queue"
import BullQueue from "bull"
import { DocumentType, SEPARATOR } from "../constants"
import { doInContext, doInTenant } from "../context"

type DocUpdateEvent = {
  id: string
  tenantId: string
  appId?: string
}

type Processor = (update: DocUpdateEvent) => Promise<void>

const processors: { types: DocumentType[]; processor: Processor }[] = []
let queue: BullQueue.Queue
let processingPromise: Promise<void>

export function init() {
  queue = createQueue<DocUpdateEvent>(JobQueue.DOC_UPDATE)
}

export async function shutdown() {
  if (queue) {
    await queue.close()
  }
}

export async function update(opts: DocUpdateEvent) {
  if (!queue) {
    init()
  }
  await queue.add(opts)
}

async function handleJob(data: DocUpdateEvent) {
  for (let { types, processor } of processors) {
    if (types.find(type => data.id.startsWith(`${type}${SEPARATOR}`))) {
      const context = data.appId || data.tenantId
      const contextFn = data.appId ? doInContext : doInTenant
      await contextFn(context, async () => {
        await processor(data)
      })
    }
  }
}

export async function process(types: DocumentType[], processor: Processor) {
  if (!queue) {
    init()
  }
  // add to processor list
  processors.push({
    types,
    processor,
  })
  // if not processing in this instance, kick it off
  if (!processingPromise) {
    processingPromise = queue.process(async job => {
      await handleJob(job.data)
    })
  }
}
