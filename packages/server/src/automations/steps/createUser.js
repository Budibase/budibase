const accessLevels = require("../../utilities/security/accessLevels")
const userController = require("../../api/controllers/user")
const env = require("../../environment")
const usage = require("../../utilities/usageQuota")

module.exports.definition = {
  description: "Create a new user",
  tagline: "Create user {{inputs.email}}",
  icon: "ri-user-add-line",
  name: "Create User",
  type: "ACTION",
  stepId: "CREATE_USER",
  inputs: {
    accessLevelId: accessLevels.BUILTIN_LEVEL_IDS.POWER,
  },
  schema: {
    inputs: {
      properties: {
        email: {
          type: "string",
          customType: "email",
          title: "Email",
        },
        password: {
          type: "string",
          customType: "password",
          title: "Password",
        },
        accessLevelId: {
          type: "string",
          title: "Access Level",
          enum: accessLevels.BUILTIN_LEVEL_ID_ARRAY,
          pretty: accessLevels.BUILTIN_LEVEL_NAME_ARRAY,
        },
      },
      required: ["email", "password", "accessLevelId"],
    },
    outputs: {
      properties: {
        id: {
          type: "string",
          description: "The identifier of the new user",
        },
        revision: {
          type: "string",
          description: "The revision of the new user",
        },
        response: {
          type: "object",
          description: "The response from the user table",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
      },
      required: ["id", "revision", "success"],
    },
  },
}

module.exports.run = async function({ inputs, appId, apiKey }) {
  const { email, password, accessLevelId } = inputs
  const ctx = {
    user: {
      appId: appId,
    },
    request: {
      body: { email, password, accessLevelId },
    },
  }

  try {
    if (env.CLOUD) {
      await usage.update(apiKey, usage.Properties.USER, 1)
    }
    await userController.create(ctx)
    return {
      response: ctx.body,
      // internal property not returned through the API
      id: ctx.userId,
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
