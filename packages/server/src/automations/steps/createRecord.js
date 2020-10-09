const recordController = require("../../api/controllers/record")
const automationUtils = require("../automationUtils")
const environment = require("../../environment")
const usage = require("../../utilities/usageQuota")

module.exports.definition = {
  name: "Create Row",
  tagline: "Create a {{inputs.enriched.table.name}} row",
  icon: "ri-save-3-fill",
  description: "Add a row to your database",
  type: "ACTION",
  stepId: "CREATE_RECORD",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        record: {
          type: "object",
          properties: {
            tableId: {
              type: "string",
              customType: "table",
            },
          },
          customType: "record",
          title: "Table",
          required: ["tableId"],
        },
      },
      required: ["record"],
    },
    outputs: {
      properties: {
        record: {
          type: "object",
          customType: "record",
          description: "The new row",
        },
        response: {
          type: "object",
          description: "The response from the table",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
        id: {
          type: "string",
          description: "The identifier of the new row",
        },
        revision: {
          type: "string",
          description: "The revision of the new row",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}

module.exports.run = async function({ inputs, instanceId, apiKey }) {
  // TODO: better logging of when actions are missed due to missing parameters
  if (inputs.record == null || inputs.record.tableId == null) {
    return
  }
  inputs.record = await automationUtils.cleanUpRecord(
    instanceId,
    inputs.record.tableId,
    inputs.record
  )
  // have to clean up the record, remove the table from it
  const ctx = {
    params: {
      tableId: inputs.record.tableId,
    },
    request: {
      body: inputs.record,
    },
    user: { instanceId },
  }

  try {
    if (environment.CLOUD) {
      await usage.update(apiKey, usage.Properties.RECORD, 1)
    }
    await recordController.save(ctx)
    return {
      record: inputs.record,
      response: ctx.body,
      id: ctx.body._id,
      revision: ctx.body._rev,
      success: ctx.status === 200,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      response: err,
    }
  }
}
