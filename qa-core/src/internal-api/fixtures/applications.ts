import { generator } from "../../shared"
import { CreateAppRequest } from "../../types"

function uniqueWord() {
  return generator.word() + generator.hash()
}

export const generateApp = (
  overrides: Partial<CreateAppRequest> = {}
): CreateAppRequest => ({
  name: uniqueWord(),
  url: `/${uniqueWord()}`,
  ...overrides,
})

// Applications type doesn't work here, save to add useTemplate parameter?
export const appFromTemplate = (): CreateAppRequest => {
  return {
    name: uniqueWord(),
    url: `/${uniqueWord()}`,
    // @ts-ignore
    useTemplate: "true",
    templateName: "Near Miss Register",
    templateKey: "app/near-miss-register",
    templateFile: undefined,
  }
}
