import { checkDockerConfigured, checkInitComplete, handleError } from "./utils"
import { info } from "../utils"
import compose from "docker-compose"

export async function status() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Budibase status"))
  await handleError(async () => {
    const response = await compose.ps()
    console.log(response.out)
  })
}
