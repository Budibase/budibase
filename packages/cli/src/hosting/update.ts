import {
  checkDockerConfigured,
  checkInitComplete,
  downloadDockerCompose,
  handleError,
  getServices,
  getServiceImage,
  setServiceImage,
} from "./utils"
import { confirmation } from "../questions"
import compose from "docker-compose"
import { COMPOSE_PATH } from "./makeFiles"
import { info, success } from "../utils"
import { start } from "./start"

const BB_COMPOSE_SERVICES = ["app-service", "worker-service", "proxy-service"]
const BB_SINGLE_SERVICE = ["budibase"]

export async function update() {
  const { services } = getServices(COMPOSE_PATH)
  const isSingle = Object.keys(services).length === 1
  await checkDockerConfigured()
  checkInitComplete()
  if (
    !isSingle &&
    (await confirmation("Do you wish to update you docker-compose.yaml?"))
  ) {
    // get current MinIO image
    const image = await getServiceImage("minio")
    await downloadDockerCompose()
    // replace MinIO image
    setServiceImage("minio", image)
  }
  await handleError(async () => {
    const status = await compose.ps()
    const parts = status.out.split("\n")
    const isUp = parts[2] && parts[2].indexOf("Up") !== -1
    if (isUp) {
      console.log(info("Stopping services, this may take a moment."))
      await compose.stop()
    }
    console.log(info("Beginning update, this may take a few minutes."))
    let services
    if (isSingle) {
      services = BB_SINGLE_SERVICE
    } else {
      services = BB_COMPOSE_SERVICES
    }
    await compose.pullMany(services, { log: true })
    if (isUp) {
      console.log(success("Update complete, restarting services..."))
      await start()
    }
  })
}
