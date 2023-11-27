const { success } = require("../utils")
const { updateDockerComposeService } = require("./utils")
const randomString = require("randomstring")
const { GENERATED_USER_EMAIL } = require("../constants")

import { DockerCompose } from "./types"

export async function generateUser(password: string | null, silent: boolean) {
  const email = GENERATED_USER_EMAIL
  if (!password) {
    password = randomString.generate({ length: 6 })
  }
  updateDockerComposeService((service: DockerCompose) => {
    service.environment["BB_ADMIN_USER_EMAIL"] = email
    service.environment["BB_ADMIN_USER_PASSWORD"] = password as string
  })
  if (!silent) {
    console.log(
      success(
        `User admin credentials configured, access with email: ${email} - password: ${password}`
      )
    )
  }
}
