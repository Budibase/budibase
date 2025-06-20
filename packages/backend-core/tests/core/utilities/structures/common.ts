import { v4 as uuid } from "uuid"
import { generator } from "./generator"

export { v4 as uuid } from "uuid"

export const email = () => {
  return `${uuid()}@example.com`
}

export const semver = () => {
  const majorVersion = generator.natural({ min: 1, max: 3 })
  const minVersion = generator.natural({ min: 1, max: 40 })
  const patchVersion = generator.natural({ min: 1, max: 50 })
  return `${majorVersion}.${minVersion}.${patchVersion}`
}
