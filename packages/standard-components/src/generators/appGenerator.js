import { forms } from "./formsGenerator"
import { nav } from "./navGenerator"

export const app = params => {
  return [...nav(params), ...forms(params)]
}
