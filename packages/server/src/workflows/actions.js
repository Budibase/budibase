const userController = require("../api/controllers/user")
const recordController = require("../api/controllers/record")
const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

let BUILTIN_ACTIONS = {
  CREATE_USER: async function(inputs) {
    const { username, password, accessLevelId } = inputs
    const ctx = {
      user: {
        instanceId: inputs.instanceId,
      },
      request: {
        body: { username, password, accessLevelId },
      },
    }

    try {
      await userController.create(ctx)
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
  },
  SAVE_RECORD: async function(inputs) {
    const ctx = {
      params: {
        instanceId: inputs.instanceId,
        modelId: inputs.model._id,
      },
      request: {
        body: inputs.record,
      },
      user: { instanceId: inputs.instanceId },
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
  },
  SEND_EMAIL: async function(inputs) {
    const msg = {
      to: inputs.to,
      from: inputs.from,
      subject: inputs.subject,
      text: inputs.text,
    }

    try {
      await sgMail.send(msg)
      return {
        success: true,
      }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        response: err,
      }
    }
  },
  DELETE_RECORD: async function(inputs) {
    const { model, ...record } = inputs.record
    // TODO: better logging of when actions are missed due to missing parameters
    if (record.recordId == null || record.revId == null) {
      return
    }
    let ctx = {
      params: {
        modelId: model._id,
        recordId: record.recordId,
        revId: record.revId,
      },
      user: { instanceId: inputs.instanceId },
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
  },
}

module.exports.getAction = async function(actionName) {
  if (BUILTIN_ACTIONS[actionName] != null) {
    return BUILTIN_ACTIONS[actionName]
  }
  // TODO: load async actions here
}
