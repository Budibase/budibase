const {
  checkDockerConfigured,
  checkInitComplete,
  handleError,
} = require("./utils")
const { info, success } = require("../utils")
const compose = require("docker-compose")

exports.stop = async () => {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Stopping services, this may take a moment."))
  await handleError(async () => {
    await compose.stop()
  })
  console.log(success("Services have been stopped successfully."))
}
