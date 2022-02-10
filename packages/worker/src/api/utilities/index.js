const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { getGlobalUserParams } = require("@budibase/backend-core/db")

exports.allUsers = async () => {
  const db = getGlobalDB()
  const response = await db.allDocs(
    getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map(row => row.doc)
}
