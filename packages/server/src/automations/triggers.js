const CouchDB = require("../db")
const emitter = require("../events/index")
const InMemoryQueue = require("../utilities/queue/inMemoryQueue")
const { getAutomationParams } = require("../db/utils")

let automationQueue = new InMemoryQueue("automationQueue")

const FAKE_STRING = "TEST"
const FAKE_BOOL = false
const FAKE_NUMBER = 1
const FAKE_DATETIME = "1970-01-01T00:00:00.000Z"

const BUILTIN_DEFINITIONS = {
  ROW_SAVED: {
    name: "Row Saved",
    event: "row:save",
    icon: "ri-save-line",
    tagline: "Row is added to {{inputs.enriched.table.name}}",
    description: "Fired when a row is saved to your database",
    stepId: "ROW_SAVED",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          tableId: {
            type: "string",
            customType: "table",
            title: "Table",
          },
        },
        required: ["tableId"],
      },
      outputs: {
        properties: {
          row: {
            type: "object",
            customType: "row",
            description: "The new row that was saved",
          },
          id: {
            type: "string",
            description: "Row ID - can be used for updating",
          },
          revision: {
            type: "string",
            description: "Revision of row",
          },
        },
        required: ["row", "id"],
      },
    },
    type: "TRIGGER",
  },
  ROW_DELETED: {
    name: "Row Deleted",
    event: "row:delete",
    icon: "ri-delete-bin-line",
    tagline: "Row is deleted from {{inputs.enriched.table.name}}",
    description: "Fired when a row is deleted from your database",
    stepId: "ROW_DELETED",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          tableId: {
            type: "string",
            customType: "table",
            title: "Table",
          },
        },
        required: ["tableId"],
      },
      outputs: {
        properties: {
          row: {
            type: "object",
            customType: "row",
            description: "The row that was deleted",
          },
        },
        required: ["row", "id"],
      },
    },
    type: "TRIGGER",
  },
  WEBHOOK: {
    name: "Webhook",
    event: "web:trigger",
    icon: "ri-global-line",
    tagline: "Webhook endpoint is hit",
    description: "Trigger an automation when a HTTP POST webhook is hit",
    stepId: "WEBHOOK",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          schemaUrl: {
            type: "string",
            customType: "webhookUrl",
            title: "Schema URL",
          },
          triggerUrl: {
            type: "string",
            customType: "webhookUrl",
            title: "Trigger URL",
          },
        },
        required: ["schemaUrl", "triggerUrl"],
      },
      outputs: {
        properties: {
          body: {
            type: "object",
            description: "Body of the request which hit the webhook",
          },
        },
        required: ["body"],
      },
    },
    type: "TRIGGER",
  },
}

async function queueRelevantRowAutomations(event, eventType) {
  if (event.instanceId == null) {
    throw `No instanceId specified for ${eventType} - check event emitters.`
  }
  const db = new CouchDB(event.instanceId)
  let automations = await db.allDocs(
    getAutomationParams(null, { include_docs: true })
  )

  // filter down to the correct event type
  automations = automations.rows
    .map(automation => automation.doc)
    .filter(automation => {
      const trigger = automation.definition.trigger
      return trigger && trigger.event === eventType
    })

  for (let automation of automations) {
    let automationDef = automation.definition
    let automationTrigger = automationDef ? automationDef.trigger : {}
    if (
      !automation.live ||
      !automationTrigger.inputs ||
      automationTrigger.inputs.tableId !== event.row.tableId
    ) {
      continue
    }
    automationQueue.add({ automation, event })
  }
}

emitter.on("row:save", async function(event) {
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRelevantRowAutomations(event, "row:save")
})

emitter.on("row:delete", async function(event) {
  if (!event || !event.row || !event.row.tableId) {
    return
  }
  await queueRelevantRowAutomations(event, "row:delete")
})

async function fillRowOutput(automation, params) {
  let triggerSchema = automation.definition.trigger
  let tableId = triggerSchema.inputs.tableId
  const db = new CouchDB(params.instanceId)
  try {
    let table = await db.get(tableId)
    let row = {}
    for (let schemaKey of Object.keys(table.schema)) {
      if (params[schemaKey] != null) {
        continue
      }
      let propSchema = table.schema[schemaKey]
      switch (propSchema.constraints.type) {
        case "string":
          row[schemaKey] = FAKE_STRING
          break
        case "boolean":
          row[schemaKey] = FAKE_BOOL
          break
        case "number":
          row[schemaKey] = FAKE_NUMBER
          break
        case "datetime":
          row[schemaKey] = FAKE_DATETIME
          break
      }
    }
    params.row = row
  } catch (err) {
    throw "Failed to find table for trigger"
  }
  return params
}

module.exports.externalTrigger = async function(automation, params) {
  // TODO: replace this with allowing user in builder to input values in future
  if (
    automation.definition != null &&
    automation.definition.trigger != null &&
    automation.definition.trigger.inputs.tableId != null
  ) {
    params = await fillRowOutput(automation, params)
  }

  automationQueue.add({ automation, event: params })
}

module.exports.automationQueue = automationQueue

module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
