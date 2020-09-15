const userController = require("../api/controllers/user")
const recordController = require("../api/controllers/record")
const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

let BUILTIN_ACTIONS = {
  CREATE_USER: async function({ args, context }) {
    const { username, password, accessLevelId } = args
    const ctx = {
      user: {
        instanceId: context.instanceId,
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
  SAVE_RECORD: async function({ args, context }) {
    const { model, ...record } = args.record

    const ctx = {
      params: {
        instanceId: context.instanceId,
        modelId: model._id,
      },
      request: {
        body: record,
      },
      user: { instanceId: context.instanceId },
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
  SEND_EMAIL: async function({ args }) {
    const msg = {
      to: args.to,
      from: args.from,
      subject: args.subject,
      text: args.text,
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
  DELETE_RECORD: async function({ args, context }) {
    const { model, ...record } = args.record
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
      user: { instanceId: context.instanceId },
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
