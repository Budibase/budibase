import { v4 as uuid } from "uuid"

export { v4 as uuid } from "uuid"

export const email = () => {
  return `${uuid()}@example.com`
}
