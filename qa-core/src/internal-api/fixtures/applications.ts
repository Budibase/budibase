import { generator } from "../../shared"
import { CreateAppRequest } from "../../types"

export const generateApp = (
  overrides: Partial<CreateAppRequest> = {}
): CreateAppRequest => ({
  name: generator.word() + generator.hash(),
  url: `/${generator.word() + generator.hash()}`,
  ...overrides,
})

// Applications type doesn't work here, save to add useTemplate parameter?
export const appFromTemplate = (): CreateAppRequest => {
  return {
    name: generator.word(),
    url: `/${generator.word()}`,
    // @ts-ignore
    useTemplate: "true",
    templateName: "Near Miss Register",
    templateKey: "app/near-miss-register",
    templateFile: undefined,
  }
}
