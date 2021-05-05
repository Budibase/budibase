const { sendEmail } = require("../../../utilities/email")
const CouchDB = require("../../../db")
const authPkg = require("@budibase/auth")

const GLOBAL_DB = authPkg.StaticDatabases.GLOBAL.name

exports.sendEmail = async ctx => {
  const { groupId, email, userId, purpose } = ctx.request.body
  let user
  if (userId) {
    const db = new CouchDB(GLOBAL_DB)
    user = await db.get(userId)
  }
  const response = await sendEmail(email, purpose, { groupId, user })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
