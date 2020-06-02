const recordController = require("../../record")

module.exports = async function saveRecord({ args, instanceId }) {
  const { model, ...record } = args.record

  const ctx = {
    params: {
      instanceId,
      modelId: model._id,
    },
    request: {
      body: record,
    },
  }

  await recordController.save(ctx)

  try {
    return {
      record: ctx.body,
    }
  } catch (err) {
    console.error(err)
    return {
      record: null,
      error: err.message,
    }
  }
}
