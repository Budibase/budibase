const CouchDB = require("../db")
const emitter = require("../events/index")
const InMemoryQueue = require("./queue/inMemoryQueue")

let workflowQueue = new InMemoryQueue()

async function queueRelevantWorkflows(event, eventType) {
  if (event.instanceId == null) {
    throw `No instanceId specified for ${eventType} - check event emitters.`
  }
  const db = new CouchDB(event.instanceId)
  const workflowsToTrigger = await db.query("database/by_workflow_trigger", {
    key: [eventType],
    include_docs: true,
  })

  const workflows = workflowsToTrigger.rows.map(wf => wf.doc)
  for (let workflow of workflows) {
    if (!workflow.live) {
      continue
    }
    workflowQueue.add({ workflow, event })
  }
}

emitter.on("record:save", async function(event) {
  await queueRelevantWorkflows(event, "record:save")
})

emitter.on("record:delete", async function(event) {
  await queueRelevantWorkflows(event, "record:delete")
})

module.exports.externalTrigger = async function(workflow, params) {
  workflowQueue.add({ workflow, event: params })
}

module.exports.workflowQueue = workflowQueue
