module.exports = async (ctx, next) => {
  // TODO: need to check the API key provided in the header
  await next()
}
