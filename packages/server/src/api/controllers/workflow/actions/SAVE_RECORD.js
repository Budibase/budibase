const recordController = require("../../record")

module.exports = async function saveRecord(args) {
  console.log("SAVING this record", args.record)

  const ctx = {
    params: {
      instanceId: "inst_60dd510_700f7dc06735403e81d5af91072d7241",
    },
    request: {
      body: args.record,
    },
  }

  await recordController.save(ctx)

  return {
    record: ctx.body,
  }
}
