const userController = require("../../user")

module.exports = async function createUser(user) {
  console.log("SAVING this user", user)

  const ctx = {
    params: {
      instanceId: "inst_60dd510_700f7dc06735403e81d5af91072d7241",
    },
    request: {
      body: user 
    },
  }

  try {
    const response = await userController.create(ctx)
    return {
      user: response
    }
  } catch (err) {
    console.error(err);
    return {
      user: null 
    }
  }
}
