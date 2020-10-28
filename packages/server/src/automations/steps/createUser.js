const accessLevels = require("../../utilities/accessLevels")
const userController = require("../../api/controllers/user")
const env = require("../../environment")
const usage = require("../../utilities/usageQuota")

module.exports.definition = {
  description: "Create a new user",
  tagline: "Create user {{inputs.username}}",
  icon: "ri-user-add-line",
  name: "Create User",
  type: "ACTION",
  stepId: "CREATE_USER",
  inputs: {
    accessLevelId: accessLevels.POWERUSER_LEVEL_ID,
  },
  schema: {
    inputs: {
      properties: {
        username: {
          type: "string",
          title: "Username",
        },
        password: {
          type: "string",
          customType: "password",
          title: "Password",
        },
        accessLevelId: {
          type: "string",
          title: "Access Level",
          enum: accessLevels.ACCESS_LEVELS,
          pretty: Object.values(accessLevels.PRETTY_ACCESS_LEVELS),
        },
      },
      required: ["username", "password", "accessLevelId"],
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

module.exports.run = async function({ inputs, instanceId, apiKey }) {
  const { username, password, accessLevelId } = inputs
  const ctx = {
    user: {
      instanceId: instanceId,
    },
    request: {
      body: { username, password, accessLevelId },
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
