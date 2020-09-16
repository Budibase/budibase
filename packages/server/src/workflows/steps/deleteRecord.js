const recordController = require("../../api/controllers/record")

module.exports.definition = {
  description: "Delete a record from your database",
  icon: "ri-delete-bin-line",
  name: "Delete Record",
  tagline: "Delete a {{inputs.enriched.model.name}} record",
  type: "ACTION",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        modelId: {
          type: "string",
          customType: "model",
          title: "Table",
        },
        id: {
          type: "string",
          title: "Record ID",
        },
        revision: {
          type: "string",
          title: "Record Revision",
        },
      },
      required: ["modelId", "id", "revision"],
    },
    outputs: {
      properties: {
        record: {
          type: "object",
          customType: "record",
          description: "The deleted record",
        },
        response: {
          type: "object",
          description: "The response from the table",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
      required: ["record", "success"],
    },
  },
}

module.exports.run = async function({ inputs, instanceId }) {
  // TODO: better logging of when actions are missed due to missing parameters
  if (inputs.id == null || inputs.revision == null) {
    return
  }
  let ctx = {
    params: {
      modelId: inputs.modelId,
      recordId: inputs.id,
      revId: inputs.revision,
    },
    user: { instanceId },
  }

  try {
    await recordController.destroy(ctx)
    return {
      response: ctx.body,
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
