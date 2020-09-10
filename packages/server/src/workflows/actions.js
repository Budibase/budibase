const userController = require("../api/controllers/user")
const recordController = require("../api/controllers/record")
const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

let BUILTIN_ACTIONS = {
  CREATE_USER: async function({ args, instanceId }) {
    const ctx = {
      params: {
        instanceId,
      },
      request: {
        body: args.user,
      },
    }

    try {
      const response = await userController.create(ctx)
      return {
        user: response,
      }
    } catch (err) {
      console.error(err)
      return {
        user: null,
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
        record: ctx.body,
      }
    } catch (err) {
      console.error(err)
      return {
        record: null,
        error: err.message,
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
        ...args,
      }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        error: err.message,
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
