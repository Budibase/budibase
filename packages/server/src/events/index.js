const EventEmitter = require("events").EventEmitter
const CouchDB = require("../db")

const emitter = new EventEmitter()

async function determineWorkflowsToTrigger(instanceId, event) {
  const db = new CouchDB(instanceId)
  const workflowsToTrigger = await db.query("database/by_workflow_trigger", {
    key: [event],
  })

  return workflowsToTrigger.rows
}

emitter.on("record:save", async function(event) {
  const workflowsToTrigger = await determineWorkflowsToTrigger(
    instanceId,
    "record:save"
  )

  for (let workflow of workflowsToTrigger) {
    // TODO: server side workflow triggers
  }
})

emitter.on("record:delete", async function(event) {
  const workflowsToTrigger = await determineWorkflowsToTrigger(
    instanceId,
    "record:delete"
  )

  for (let workflow of workflowsToTrigger) {
    // TODO: server side workflow triggers
  }
})

module.exports = emitter
