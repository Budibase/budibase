const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { getGlobalUserParams } = require("@budibase/backend-core/db")

/**
 * Retrieves all users from the current tenancy.
 */
exports.allUsers = async () => {
  const db = getGlobalDB()
  const response = await db.allDocs(
    getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc)
}

/**
 * Gets a user by ID from the global database, based on the current tenancy.
 */
exports.getUser = async userId => {
  const db = getGlobalDB()
  let user
  try {
    user = await db.get(userId)
  } catch (err) {
    // no user found, just return nothing
    user = {}
  }
  if (user) {
    delete user.password
  }
  return user
}
