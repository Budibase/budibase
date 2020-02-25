module.exports = ({ masterAppInternal, instanceKey, app }) => async ({
  user,
}) => {
  const { bbMaster } = masterAppInternal
  const existingUser = await masterAppInternal.getUser(app.id, user.name)

  if (existingUser) return

  const masterUser = bbMaster.recordApi.getNew(`${app.key}/users`, "user")
  masterUser.name = user.name
  bbMaster.recordApi.setCustomId(masterUser, masterUser.name)
  masterUser.createdByMaster = false
  masterUser.instance = await bbMaster.recordApi.load(instanceKey)

  masterUser.active = user.enabled
  await bbMaster.recordApi.save(masterUser)
}

exports.timeout = ms => new Promise(resolve => setTimeout(resolve, ms))
