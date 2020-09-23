const recordController = require("../../api/controllers/record")
const automationUtils = require("../automationUtils")

module.exports.definition = {
  name: "Update Record",
  tagline: "Update a {{inputs.enriched.model.name}} record",
  icon: "ri-refresh-fill",
  description: "Update a record to your database",
  type: "ACTION",
  stepId: "UPDATE_RECORD",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        record: {
          type: "object",
          customType: "record",
          title: "Record",
        },
        recordId: {
          type: "string",
          title: "Record ID",
        },
      },
      required: ["record", "recordId"],
    },
    outputs: {
      properties: {
        record: {
          type: "object",
          customType: "record",
          description: "The updated record",
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
          description: "The identifier of the updated record",
        },
        revision: {
          type: "string",
          description: "The revision of the updated record",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}

module.exports.run = async function({ inputs, instanceId }) {
  if (inputs.recordId == null || inputs.record == null) {
    return
  }

  inputs.record = await automationUtils.cleanUpRecordById(
    instanceId,
    inputs.recordId,
    inputs.record
  )
  // clear any falsy properties so that they aren't updated
  for (let propKey of Object.keys(inputs.record)) {
    if (!inputs.record[propKey] || inputs.record[propKey] === "") {
      delete inputs.record[propKey]
    }
  }

  // have to clean up the record, remove the model from it
  const ctx = {
    params: {
      id: inputs.recordId,
    },
    request: {
      body: inputs.record,
    },
    user: { instanceId },
  }

  try {
    await recordController.patch(ctx)
    return {
      record: ctx.body,
      response: ctx.message,
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
