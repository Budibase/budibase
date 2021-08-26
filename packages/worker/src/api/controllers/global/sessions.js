const {
  getAllSessions,
  getUserSessions,
  invalidateSessions,
} = require("@budibase/auth/sessions")

exports.fetch = async ctx => {
  ctx.body = await getAllSessions()
}

exports.find = async ctx => {
  const { userId } = ctx.params
  const sessions = await getUserSessions(userId)
  ctx.body = sessions.map(session => session.value)
}

exports.invalidateUser = async ctx => {
  const { userId } = ctx.params
  await invalidateSessions(userId)
  ctx.body = {
    message: "User sessions invalidated",
  }
}

exports.selfSessions = async ctx => {
  const userId = ctx.user._id
  ctx.body = await getUserSessions(userId)
}

exports.invalidateSession = async ctx => {
  const userId = ctx.user._id
  const { sessionId } = ctx.params
  await invalidateSessions(userId, sessionId)
  ctx.body = {
    message: "Session invalidated successfully.",
  }
}
