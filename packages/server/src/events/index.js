const EventEmitter = require("events").EventEmitter
const CouchDB = require("../db")
const { Orchestrator, serverStrategy } = require("./workflow");

const emitter = new EventEmitter()

async function executeRelevantWorkflows(event, eventType) {
  const db = new CouchDB(event.instanceId)
  const workflowsToTrigger = await db.query("database/by_workflow_trigger", {
    key: [eventType],
    include_docs: true
  })

  const workflows = workflowsToTrigger.rows.map(wf => wf.doc)

  // Create orchestrator
  const workflowOrchestrator = new Orchestrator()
  workflowOrchestrator.strategy = serverStrategy

  for (let workflow of workflows) {
    workflowOrchestrator.execute(workflow)
  }
}

emitter.on("record:save", async function(event) {
  await executeRelevantWorkflows(event, "record:save");
})

emitter.on("record:delete", async function(event) {
  await executeRelevantWorkflows(event, "record:delete");
})

module.exports = emitter
