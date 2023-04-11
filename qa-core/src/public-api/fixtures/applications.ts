import { generator } from "../../shared"
import { Application, CreateApplicationParams } from "../../types"

export const generateApp = (
  overrides: Partial<Application> = {}
): CreateApplicationParams => ({
  name: generator.word(),
  url: `/${generator.word()}`,
  ...overrides,
})
