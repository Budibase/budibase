const EventEmitter = require("events").EventEmitter
const CouchDB = require("../db");

const emitter = new EventEmitter()

function determineWorkflowsToTrigger(instanceId, event) {
  const db = new CouchDB(instanceId);
  const workflowsToTrigger = await db.query("database/by_workflow_trigger", {
    key: [event]
  })

  return workflowsToTrigger.rows;
}

emitter.on("record:save", async function(event) {
  const workflowsToTrigger = await determineWorkflowsToTrigger(instanceId, "record:save") 

  for (let workflow of workflowsToTrigger) {
    // SERVER SIDE STUFF!!
  }
})

emitter.on("record:delete", function(event) {
  const workflowsToTrigger = await determineWorkflowsToTrigger(instanceId, "record:delete") 

  for (let workflow of workflowsToTrigger) {
    // SERVER SIDE STUFF!!
  }
})

module.exports = emitter
