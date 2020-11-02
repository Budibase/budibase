const env = require("../environment")

exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.isDev = () => {
  return (
    !env.CLOUD &&
    env.NODE_ENV !== "production" &&
    env.NODE_ENV !== "jest" &&
    env.NODE_ENV !== "cypress"
  )
}

exports.getAppId = ctx => {

}
