import { isFreePlan } from "./utils.js"

export const logoEnabled = () => {
  return isFreePlan()
}
