const recordController = require("../../api/controllers/record")

module.exports.definition = {
  name: "Save Record",
  tagline: "Save a {{inputs.enriched.model.name}} record",
  icon: "ri-save-3-fill",
  description: "Save a record to your database",
  type: "ACTION",
  stepId: "SAVE_RECORD",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        record: {
          type: "object",
          properties: {
            modelId: {
              type: "string",
              customType: "model",
              title: "Table",
            },
          },
          customType: "record",
          title: "The record to be written",
          default: {},
          required: ["modelId"],
        },
      },
      required: ["record"],
    },
    outputs: {
      properties: {
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
          description: "The identifier of the new record",
        },
        revision: {
          type: "string",
          description: "The revision of the new record",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}

module.exports.run = async function({ inputs, instanceId }) {
  // TODO: better logging of when actions are missed due to missing parameters
  if (inputs.record == null || inputs.record.modelId == null) {
    return
  }
  // have to clean up the record, remove the model from it
  const ctx = {
    params: {
      modelId: inputs.record.modelId,
    },
    request: {
      body: inputs.record,
    },
    user: { instanceId },
  }

  try {
    await recordController.save(ctx)
    return {
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
