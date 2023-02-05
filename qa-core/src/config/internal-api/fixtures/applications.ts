import generator from "../../generator"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"
import { Template } from "@budibase/types"
import { App } from "@budibase/types"

export const generateApp = (
  overrides: Partial<Application> = {}
): Partial<Application> => ({
  name: generator.word() + generator.hash(),
  url: `/${generator.word() + generator.hash()}`,
  ...overrides,
})

// Applications type doesn't work here, save to add useTemplate parameter?
export const appFromTemplate = (): any => {
  return {
    name: generator.word(),
    url: `/${generator.word()}`,
    useTemplate: "true",
    templateName: "Near Miss Register",
    templateKey: "app/near-miss-register",
    templateFile: undefined,
  }
}
