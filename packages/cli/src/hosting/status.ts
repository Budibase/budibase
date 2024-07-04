import compose from "docker-compose"
import { info } from "../utils"
import { checkDockerConfigured, checkInitComplete, handleError } from "./utils"

export async function status() {
  await checkDockerConfigured()
  checkInitComplete()
  console.log(info("Budibase status"))
  await handleError(async () => {
    const response = await compose.ps()
    console.log(response.out)
  })
}
