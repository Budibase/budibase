exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.isDev = () => {
  return (
    !process.env.CLOUD &&
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== "jest" &&
    process.env.NODE_ENV !== "cypress"
  )
}
