const {
  checkDockerConfigured,
  checkInitComplete,
  handleError,
} = require("./utils")
const { info } = require("../utils")
const compose = require("docker-compose")

exports.status = async () => {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Budibase status"))
  await handleError(async () => {
    const response = await compose.ps()
    console.log(response.out)
  })
}
