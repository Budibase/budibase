module.exports = ({ masterAppInternal, app }) => async ({ username }) => {
  await masterAppInternal.disableUser(app, username)
}
