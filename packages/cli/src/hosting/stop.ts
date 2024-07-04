import compose from "docker-compose"
import { info, success } from "../utils"
import { checkDockerConfigured, checkInitComplete, handleError } from "./utils"

export async function stop() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Stopping services, this may take a moment."))
  await handleError(async () => {
    await compose.stop()
  })
  console.log(success("Services have been stopped successfully."))
}
