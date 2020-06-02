const userController = require("../../user")

module.exports = async function createUser({ args, instanceId }) {
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
}
