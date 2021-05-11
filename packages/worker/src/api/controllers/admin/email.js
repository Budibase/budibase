const { sendEmail } = require("../../../utilities/email")
const CouchDB = require("../../../db")
const authPkg = require("@budibase/auth")

const GLOBAL_DB = authPkg.StaticDatabases.GLOBAL.name

exports.sendEmail = async ctx => {
  const { groupId, email, userId, purpose, contents, from, subject } = ctx.request.body
  let user
  if (userId) {
    const db = new CouchDB(GLOBAL_DB)
    user = await db.get(userId)
  }
  const response = await sendEmail(email, purpose, { groupId, user, contents, from, subject })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
